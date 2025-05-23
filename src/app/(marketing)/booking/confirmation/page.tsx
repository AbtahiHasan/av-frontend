"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import api from "@/config/axios.config";
import { useToast } from "@/hooks/use-toast";
import { get_socket } from "@/utils/get-socket";
import { Calendar, Check, Clock, Video } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface BookingConfirmation {
  id: string;
  appointmentType: string;
  status: string;
  mentorUserName: string;
  menteeUserName: string;
  selectedSlot: Array<{
    time: string;
    isAvailable: boolean;
  }>;
  createdAt: string;
}

interface SessionDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SessionDetail = ({ icon, label, value }: SessionDetailProps) => (
  <div className="flex items-center gap-4 p-4 bg-soft-paste/10 rounded-lg">
    {icon}
    <div>
      <p className="text-xs text-soft-paste-dark">{label}</p>
      <p className="text-sm font-medium text-soft-paste-darker">{value}</p>
    </div>
  </div>
);

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [show, setShow] = useState(false);
  const [isDisagree, setIsDisagree] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    setSocket(get_socket());
  }, []);
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await api.get(`/api/v1/appointments/${bookingId}`);
        if (!data?.data) {
          throw new Error("Booking not found");
        }
        setBooking(data.data);
        const id = localStorage.getItem("application");
        if (id === data.data?._id) {
          setShow(false);
        } else {
          setShow(true);
        }
      } catch (error) {
        console.error("Error fetching booking details: ", error);
        toast({
          title: "Invalid Booking",
          description:
            "This booking does not exist or you don't have access to view it",
          duration: 3000,
        });
        router.push("/");
      }
    };
    fetchBookingDetails();
  }, [bookingId, router, toast]);

  if (!booking || !socket) return null;

  const agree = async () => {
    await api.post("/api/v1/notifications/create-notification", {
      receiver: "listener",
      type: `${booking.appointmentType}_request`,
      listenerUsername: booking.mentorUserName,
      content: `A new chat request has been created by ${booking.menteeUserName}.`,
      isSeen: false,
    });
    socket.emit("notification", {
      receiver: "listener",
      receiver_username: booking.mentorUserName,
      type: `${booking.appointmentType}_request`,
      content: `A new ${booking.appointmentType} request has been created by ${booking.menteeUserName}.`,
    });

    if (booking.appointmentType !== "Booking Call") {
      socket.emit("is-able-to-chat", {
        menteeUserName: booking.menteeUserName,
      });
    }

    localStorage.setItem("book-application", JSON.stringify(true));
    localStorage.setItem("application", booking._id);
  };

  const disagree = async () => {
    setIsDisagree(true);

    if (bookingId) {
      await api.delete(`/api/v1/appointments/${bookingId}`);
    }
  };

  return (
    <>
      <div className="min-h-screen py-6 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="p-6 shadow border-soft-paste/20">
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="h-16 w-16 bg-soft-paste/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {!isDisagree ? (
                    <Check size={24} className="text-soft-paste" />
                  ) : (
                    <Image
                      src="/images/cross.png"
                      width={24}
                      height={24}
                      alt="cross"
                    />
                  )}
                </div>
                <h1 className="text-xl font-bold text-violet-hover">
                  Booking {isDisagree ? "Cancelled" : "Confirmed"}
                </h1>
                {isDisagree ? (
                  <p className="text-sm text-red-800 mt-2">
                    Your session has been failed to scheduled
                  </p>
                ) : (
                  <p className="text-sm text-soft-paste-darker mt-2">
                    Your session has been successfully scheduled
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <SessionDetail
                  icon={<Calendar size={20} className="text-soft-paste" />}
                  label="Date"
                  value={new Date(booking.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}
                />
                <SessionDetail
                  icon={<Clock size={20} className="text-soft-paste" />}
                  label="Time"
                  value={booking.selectedSlot[0].time}
                />
                <SessionDetail
                  icon={<Video size={20} className="text-soft-paste" />}
                  label="Session Type"
                  value={booking.appointmentType}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full bg-soft-paste hover:bg-soft-paste-active text-white"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          {/* Modal */}
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
            {/* Header */}
            <div className="bg-[#30a6b7] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-medium">Terms of Use </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p>
                Anonymous Voices is intended to provide general information and
                a safe space for individuals to express their thoughts and
                emotions. It is not a source of medical advice or treatment
                recommendations.
              </p>

              <p>
                If you have concerns about your mental, emotional, or physical
                health, please seek help from a qualified healthcare
                professional. Any decisions made from the information provided
                on this platform are your own responsibility, and Anonymous
                Voices holds no liability.
              </p>

              <p>
                It is not a crisis hotline. If you are in an immediate crisis,
                please call 999 or your local emergency services.
              </p>
              <p>
                By using Anonymous Voices, you agree to these Terms of Use.{" "}
              </p>

              {/* Buttons */}
              <div className="flex justify-start gap-4 pt-4">
                <button
                  onClick={() => {
                    setShow(false);
                    agree();
                  }}
                  className="px-8 py-2 rounded-full bg-[#30a6b7] text-white hover:bg-[#2a95a5] transition-colors"
                >
                  Agree
                </button>
                <button
                  onClick={() => {
                    setShow(false);
                    disagree();
                  }}
                  className="px-8 py-2 rounded-full border border-[#30a6b7] text-[#30a6b7] hover:bg-gray-50 transition-colors"
                >
                  Disagree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
