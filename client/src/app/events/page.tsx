"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useWalletClient } from "@thalalabs/surf/hooks";
import { aptosClient } from "../../../utils/aptosClient";
import { EVION_ABI } from "../../../utils/evion";
import { toast } from "../components/ui/use-toast";

// import Token from "../contractInfo/contractAbi.json"
// import contractAddress from "../contractInfo/contract.json"

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isPublic: boolean;
  imageUrl: string;
  isFree: boolean;
  requiresApproval: boolean;
  capacity: string;
}

// Custom Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-800 to-purple-900 text-white border border-gray-700 p-6 shadow-xl transition-all w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();




  const { account, connected, disconnect, wallet } = useWallet();
  
  
    // Uncomment and use the wallet client hook to get the client instance
    const { client } = useWalletClient();
  
    
    const address = "0x5a5d125b5d1c3b57cc8b0901196139bff53c53d7d27dc8c27edea4190fa7f381";

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'public') return event.isPublic;
    return !event.isPublic;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleJoinEvent = (event: Event) => {
    // Here you would typically handle the join logic
    alert(`Joined event: ${event.name}`);
    setIsModalOpen(false);
    mint()
  };

  const mint = async (a = "5") => {
    if (!client || !account) {
      return;
    }

    try {
      const committedTransaction = await client.useABI(EVION_ABI).mint({
        type_arguments: [],
        arguments: [account.address.toString(), 1000000000],
      });
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["message-content"],
      // });
      toast({
        title: "Success",
        description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-black via-gray-800 to-purple-900 rounded-2xl shadow-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Events</h1>
              <p className="text-gray-400">
                {events.length} event{events.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('public')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'public'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Public
                </button>
                <button
                  onClick={() => setFilter('private')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'private'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Private
                </button>
              </div>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-all hover:scale-105 duration-150">
                <Link href="/create">Create New Event</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="bg-gradient-to-br from-black via-gray-800 to-purple-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              {/* Event Image */}
              <div className="relative h-48">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.isPublic 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-gray-800/80 text-gray-200'
                  }`}>
                    {event.isPublic ? 'Public' : 'Private'}
                  </span>
                  {event.requiresApproval && (
                    <span className="bg-yellow-500/80 text-white px-3 py-1 rounded-full text-sm">
                      Approval Required
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Event Details */}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white line-clamp-1">
                  {event.name || 'Untitled Event'}
                </h2>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300 gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">Starts</span>
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center text-gray-300 gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 line-clamp-2 min-h-[3em]">
                  {event.description || 'No description provided'}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <span className={`text-sm font-medium ${
                    event.isFree ? 'text-green-400' : 'text-purple-400'
                  }`}>
                    {event.isFree ? 'Free Entry' : 'Paid Event'}
                  </span>
                  <span className="text-sm text-gray-400">
                    Capacity: {event.capacity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Event Detail Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {selectedEvent.name}
                </h2>
                <p className="text-gray-400">
                  {selectedEvent.description}
                </p>
              </div>
              
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Start Time</h3>
                  <p className="text-gray-400">{formatDate(selectedEvent.startDate)}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">End Time</h3>
                  <p className="text-gray-400">{formatDate(selectedEvent.endDate)}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="text-gray-400">{selectedEvent.location}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Capacity</h3>
                  <p className="text-gray-400">{selectedEvent.capacity}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="space-x-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedEvent.isPublic 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-gray-800/80 text-gray-200'
                  }`}>
                    {selectedEvent.isPublic ? 'Public' : 'Private'}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedEvent.isFree 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-purple-500/80 text-white'
                  }`}>
                    {selectedEvent.isFree ? 'Free Entry' : 'Paid Event'}
                  </span>
                </div>
                
                <button
                  onClick={() => handleJoinEvent(selectedEvent)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-semibold shadow-lg transition-colors"
                >
                  Join Event
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-gradient-to-br from-black via-gray-800 to-purple-900 rounded-2xl shadow-xl border border-gray-700 p-12 text-center">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <svg 
                className="w-16 h-16 text-gray-600 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" 
                />
              </svg>
              <h3 className="text-gray-400 mb-4">
                {filter === 'all'
                  ? "Ready to host your first event? Click the 'Create New Event' button to get started!"
                  : `No ${filter} events found. Try creating one or checking a different filter.`}
              </h3>
              <button 
                onClick={() => router.push('/create')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-colors"
              >
                Create New Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
              