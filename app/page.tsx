import { TravelForm } from "@/components/travel-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          AI Travel Planner
        </h1>
        <TravelForm />
      </div>
    </main>
  );
}