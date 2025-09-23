"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import CheckAuth from "@/components/checkAuth";
import { Button } from "@/components/ui/button";
import { simulatePurchase } from "@/app/utils/simulateTransaction";
import {
  fetchUserTransactions,
  Transaction,
} from "@/app/utils/fetchTransaction";
import { QRCodeCanvas } from "qrcode.react";

// Helper to shuffle an array
const shuffleArray = (arr: string[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generate username from phone number (last 4 digits shuffled + random string)
const generateUsernameFromPhone = (phone: string) => {
  const last4 = phone.slice(-4).split("");
  const shuffled = shuffleArray(last4).join("");
  const randomStr = Math.random().toString(36).substring(2, 6);
  return shuffled + randomStr;
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [clientUser, setClientUser] = useState(() => {
    if (!user) return null;
    return user.username
      ? user
      : {
          ...user,
          username: user.phoneNumber
            ? generateUsernameFromPhone(user.phoneNumber)
            : "User" + Math.floor(Math.random() * 1000),
        };
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // QR timer states
  const [qrExpiry, setQrExpiry] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ensure rendering only on client
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!user) return;
    setClientUser((prev) => {
      if (!prev || prev._id !== user._id) {
        return user.username
          ? user
          : {
              ...user,
              username: user.phoneNumber
                ? generateUsernameFromPhone(user.phoneNumber)
                : "User" + Math.floor(Math.random() * 1000),
            };
      }
      return prev;
    });
  }, [user]);

  // Redirect logic
  useEffect(() => {
    if (!isClient || !clientUser) return;

    if (clientUser.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }
    if (clientUser._id !== params.id) {
      router.replace(`/users/${clientUser._id}`);
      return;
    }
  }, [isClient, clientUser, params.id, router]);

  // Fetch transactions
  useEffect(() => {
    if (!clientUser?._id) return;
    const fetchTransactions = async () => {
      const txs = await fetchUserTransactions(clientUser._id);
      setTransactions(txs);
    };
    fetchTransactions();
  }, [clientUser?._id]);

  const allItems = transactions.flatMap((tx, txIndex) =>
    tx.items.map((item, itemIndex) => ({
      ...item,
      txIndex,
      itemIndex,
      purchasedDate: tx.purchasedDate,
      txId: tx._id,
    }))
  );

  const totalPages = Math.max(Math.ceil(allItems.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // QR countdown timer effect
  useEffect(() => {
    if (!qrExpiry || !isQrDialogOpen) return;
    const interval = setInterval(() => {
      const secondsLeft = Math.floor((qrExpiry.getTime() - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        setTimeLeft(0);
        setIsQrDialogOpen(false); // auto-close when expired
        clearInterval(interval);
      } else {
        setTimeLeft(secondsLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrExpiry, isQrDialogOpen]);

  if (!isClient || !clientUser) return <CheckAuth />;

  const formatTxDate = (tx: Transaction) => {
    let date: Date | null = null;
    if (tx.purchasedDate) date = new Date(tx.purchasedDate);
    else if (tx._id)
      date = new Date(parseInt(tx._id.toString().substring(0, 8), 16) * 1000);

    return date
      ? date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "No date";
  };

  // Generate QR token
  const handleGenerateQr = async () => {
    if (!clientUser?._id) return;
    try {
      const res = await fetch("/api/qr_verifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: clientUser._id }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to generate QR code");
        return;
      }

      const data = await res.json();
      setQrToken(data.token);

      // Set expiry 5 minutes from now
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      setQrExpiry(expiresAt);
      setTimeLeft(5 * 60);

      setIsQrDialogOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  return (
    <div className="w-full h-[80vh] mt-[8%] px-6 antialiased grid grid-rows-[0.2fr_0.01fr_0.9fr]">
      {/* Header */}
      <div className="w-full grid grid-cols-[0.5fr_1.5fr_0.5fr]">
        <div className="flex pl-3 flex-col items-center justify-center">
          <Button
            variant="outline"
            onClick={async () => {
              if (isSimulating) return;
              setIsSimulating(true);
              try {
                const newTx = await simulatePurchase(clientUser._id);
                if (newTx) setTransactions((prev) => [...prev, newTx]);
              } finally {
                setIsSimulating(false);
              }
            }}
            disabled={isSimulating}
            className="mb-5 hover:cursor-pointer"
          >
            {isSimulating ? "Processing..." : "Simulate Purchase"}
          </Button>

          <Button
            variant="outline"
            disabled={transactions.length === 0}
            className="ml-2 hover:cursor-pointer"
            onClick={async () => {
              if (!clientUser?._id) return;
              try {
                const res = await fetch(
                  `/api/deleteHistory?userId=${clientUser._id}`,
                  { method: "DELETE" }
                );
                const data = await res.json();
                if (res.ok) {
                  setTransactions([]);
                  alert(`Deleted ${data.deletedCount} transaction(s)`);
                } else {
                  alert(data.error || "Failed to delete transactions");
                }
              } catch (err) {
                console.error(err);
                alert("Error deleting transactions");
              }
            }}
          >
            Delete History
          </Button>
        </div>

        <div className="pl-3 pr-3 pt-3 flex flex-col">
          <div className="text-2xl font-bold mb-1">
            Username: @{clientUser?.username || "Loading..."}
          </div>
          <div className="mt-1 mb-1">
            Gender:{" "}
            {clientUser.gender &&
              clientUser.gender.charAt(0).toUpperCase() +
                clientUser.gender.slice(1)}
          </div>
          <div className="mt-1 mb-1">
            Birthdate:{" "}
            {new Date(clientUser.dob ?? "").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="mt-1 mb-1">
            Age:{" "}
            {clientUser.dob
              ? Math.floor(
                  (new Date().getTime() - new Date(clientUser.dob).getTime()) /
                    3.15576e10
                )
              : "N/A"}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={handleGenerateQr}
          >
            Show QR Code
          </Button>

          {isQrDialogOpen && qrToken && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
              onClick={() => setIsQrDialogOpen(false)}
            >
              <div
                className="relative p-6 rounded-xl bg-white flex flex-col items-center justify-center w-[25%]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Icon on top-right */}
                <button
                  className="absolute top-6 right-6 hover:opacity-80"
                  onClick={() => setIsQrDialogOpen(false)}
                >
                  <img src="/close_icon.png" alt="Close" className="w-6 h-6 cursor-pointer" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-black">
                  Your QR Code
                </h2>
                <QRCodeCanvas value={qrToken} size={180} ref={qrCanvasRef} />

                {/* Timer */}
                <div className="mt-2 text-sm text-red-600 font-bold">
                  Expires in:{" "}
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeLeft % 60).toString().padStart(2, "0")}
                </div>

                {/* Bottom-left custom icon buttons */}
                <div className="flex flex-row mt-4 justify-center w-full space-x-4">
                  <button onClick={handleGenerateQr}>
                    <img
                      src="/refresh.png"
                      alt="Refresh QR"
                      className="w-7 h-7 hover:opacity-80 cursor-pointer"
                    />
                  </button>

                  <button
                    onClick={() => {
                      if (!qrCanvasRef.current) return;
                      const url = qrCanvasRef.current.toDataURL("image/png");
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${clientUser.username?.toUpperCase()}-QR.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <img
                      src="/download_icon.png"
                      alt="Download QR"
                      className="w-7 h-7 hover:opacity-80 cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-10">
        <hr />
      </div>

      {/* Dashboard Body */}
      <div className="w-full font-bold text-center grid grid-cols-5 overflow-y-scroll scrollbar-hidden">
        <div>No.</div>
        <div>Product Name</div>
        <div>Product ID</div>
        <div>Result</div>
        <div>Purchased Date</div>

        {currentItems.map((item, index) => (
          <div
            key={`${item.txId}-${item.itemIndex}-${startIndex + index}`}
            className="contents font-normal text-sm"
          >
            <div>{startIndex + index + 1}</div>
            <div>{item.name}</div>
            <div>{item.productID}</div>
            <div>{item.result}</div>
            <div>
              {formatTxDate({
                purchasedDate: item.purchasedDate,
                _id: item.txId,
              } as Transaction)}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="h-fit flex justify-center gap-2 mt-2">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="w-15 h-10 hover:cursor-pointer"
        >
          Prev
        </Button>

        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-15 h-10 hover:cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
