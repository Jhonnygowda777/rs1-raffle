import { useState } from "react";
import { Ticket, IndianRupee, Trophy, Users, CheckCircle2, Sparkles, X, Copy, ExternalLink, ShieldCheck, Clock } from "lucide-react";

export default function RaffleApp() {
  const UPI_ID = "millionairetraderboy-1@okhdfcbank";
  const ENTRY_FEE = 1;
  const PAYEE_NAME = "Raffle Entry";

  const [entrants, setEntrants] = useState([]);
  const [pending, setPending] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("form");
  const [winner, setWinner] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const buildUpiLink = (ticketNo) => {
    const note = encodeURIComponent(`Raffle ${ticketNo}`);
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${ENTRY_FEE}&cu=INR&tn=${note}`;
  };

  const handleStart = () => {
    setError("");
    if (!name.trim()) return setError("Please enter your name");
    if (!phone.trim() || phone.trim().length < 10) return setError("Please enter a valid 10-digit phone number");

    const ticketNo = `RAF-${1000 + entrants.length + pending.length + 1}`;
    const newPending = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      ticketNo,
      time: new Date().toLocaleString(),
    };
    setPending((prev) => [...prev, newPending]);
    setStage("paylink");
  };

  const currentPending = pending[pending.length - 1];

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClaimedPaid = () => {
    setStage("submitted");
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setStage("form");
    setError("");
  };

  const confirmPayment = (id) => {
    const entry = pending.find((p) => p.id === id);
    if (!entry) return;
    setPending((prev) => prev.filter((p) => p.id !== id));
    setEntrants((prev) => [...prev, entry]);
  };

  const rejectPending = (id) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const drawWinner = () => {
    if (entrants.length === 0) return;
    setDrawing(true);
    setWinner(null);
    let ticks = 0;
    const maxTicks = 18;
    const interval = setInterval(() => {
      const random = entrants[Math.floor(Math.random() * entrants.length)];
      setWinner(random);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setDrawing(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center px-4 py-8 font-sans">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/30">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">₹1 Raffle</h1>
            <p className="text-indigo-300 text-xs">Pay via UPI to enter</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdmin((s) => !s)}
          className="flex items-center gap-1 text-indigo-200 bg-white/10 hover:bg-white/20 transition px-3 py-1.5 rounded-full text-xs font-medium"
        >
          <Users className="w-3.5 h-3.5" />
          {entrants.length}
          {pending.length > 0 && (
            <span className="ml-1 bg-amber-400 text-slate-900 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
              {pending.length}
            </span>
          )}
        </button>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        {stage === "form" && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30">
                <Sparkles className="w-3 h-3" />
                Live Draw Raffle
              </div>
              <h2 className="text-white text-2xl font-bold mt-3">
                Entry Fee: <span className="text-amber-400">₹{ENTRY_FEE}</span>
              </h2>
              <p className="text-indigo-200 text-sm mt-1">Pay via UPI and get a shot at the prize draw</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-indigo-200 text-xs font-medium mb-1 block">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-300/60 outline-none focus:border-amber-400 transition"
                />
              </div>
              <div>
                <label className="text-indigo-200 text-xs font-medium mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-indigo-300/60 outline-none focus:border-amber-400 transition"
                />
              </div>
              {error && (
                <p className="text-red-300 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98]"
            >
              <IndianRupee className="w-4 h-4" />
              Continue to Pay ₹{ENTRY_FEE}
            </button>
          </div>
        )}

        {stage === "paylink" && currentPending && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-white text-xl font-bold">Pay ₹{ENTRY_FEE} via UPI</h3>
              <p className="text-indigo-200 text-sm mt-1">Ticket {currentPending.ticketNo}</p>
            </div>

            <a
              href={buildUpiLink(currentPending.ticketNo)}
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 transition text-slate-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              Open UPI App to Pay
            </a>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-indigo-300 text-[11px]">Or pay manually to</p>
                <p className="text-white font-mono text-sm">{UPI_ID}</p>
              </div>
              <button
                onClick={handleCopyUpi}
                className="bg-white/10 hover:bg-white/20 transition p-2 rounded-lg text-indigo-200"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-emerald-300 text-xs text-center -mt-2">Copied!</p>}

            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-amber-200 text-xs flex gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>The "Open UPI App to Pay" button only works on a phone with a UPI app installed. After paying, tap below — the organizer will manually verify the ₹1 credit before confirming your entry.</span>
            </div>

            <button
              onClick={handleClaimedPaid}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition text-slate-900 font-bold py-3.5 rounded-xl"
            >
              I've Paid ₹{ENTRY_FEE}
            </button>
          </div>
        )}

        {stage === "submitted" && currentPending && (
          <div className="py-4 flex flex-col items-center text-center gap-4">
            <div className="bg-amber-400/20 p-3 rounded-full border border-amber-400/30">
              <Clock className="w-10 h-10 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">Awaiting Verification</h3>
              <p className="text-indigo-200 text-sm mt-1">
                Your entry is pending until the organizer confirms your ₹{ENTRY_FEE} payment
              </p>
            </div>
            <div className="w-full bg-white/10 border border-dashed border-amber-400/40 rounded-2xl p-4 text-left space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-300">Ticket No.</span>
                <span className="text-amber-400 font-bold tracking-wide">{currentPending.ticketNo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-300">Name</span>
                <span className="text-white font-medium">{currentPending.name}</span>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="w-full bg-white/10 hover:bg-white/20 transition text-white font-semibold py-3 rounded-xl border border-white/20"
            >
              Add Another Entry
            </button>
          </div>
        )}
      </div>

      {showAdmin && (
        <div className="w-full max-w-md mt-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-bold">Admin Panel</h3>
            </div>
            <button onClick={() => setShowAdmin(false)} className="text-indigo-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {pending.length > 0 && (
            <div>
              <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide mb-2">
                Pending Verification ({pending.length})
              </p>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {pending.map((p) => (
                  <div key={p.id} className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white">{p.name}</span>
                      <span className="text-indigo-300 font-mono">{p.ticketNo}</span>
                    </div>
                    <p className="text-indigo-300/70 text-[10px] mb-2">{p.phone} · {p.time}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmPayment(p.id)}
                        className="flex-1 bg-emerald-500/80 hover:bg-emerald-400 transition text-white text-xs font-semibold py-1.5 rounded-lg"
                      >
                        Confirm Paid
                      </button>
                      <button
                        onClick={() => rejectPending(p.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 transition text-red-200 text-xs font-semibold py-1.5 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-indigo-200 text-sm mb-3">
              {entrants.length} confirmed {entrants.length === 1 ? "entry" : "entries"} · Pool: ₹{entrants.length * ENTRY_FEE}
            </p>
            <div className="max-h-32 overflow-y-auto space-y-1.5 mb-4 pr-1">
              {entrants.length === 0 && (
                <p className="text-indigo-300/60 text-xs text-center py-4">No confirmed entries yet</p>
              )}
              {entrants.map((e) => (
                <div
                  key={e.id}
                  className={`flex justify-between items-center text-xs px-3 py-2 rounded-lg border ${
                    winner?.id === e.id ? "bg-amber-400/20 border-amber-400/50" : "bg-white/5 border-white/10"
                  }`}
                >
                  <span className="text-white">{e.name}</span>
                  <span className="text-indigo-300 font-mono">{e.ticketNo}</span>
                </div>
              ))}
            </div>

            <button
              onClick={drawWinner}
              disabled={entrants.length === 0 || drawing}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              {drawing ? "Drawing..." : "Draw Winner"}
            </button>

            {winner && !drawing && (
              <div className="mt-4 bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/40 rounded-xl p-4 text-center">
                <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide">🎉 Winner</p>
                <p className="text-white text-lg font-bold mt-1">{winner.name}</p>
                <p className="text-indigo-200 text-xs font-mono">{winner.ticketNo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
    }
