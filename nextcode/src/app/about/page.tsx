"use client";

import React, { useState } from "react";

export default function AboutUsPage() {
  const [activeCommitment, setActiveCommitment] = useState(0);

  const commitments = [
    {
      icon: "🎯",
      title: "Quality First",
      description: "We partner only with verified campus canteens that maintain high food safety standards"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Average order preparation time reduced by 40% with our smart kitchen integration"
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "Your transactions are protected with bank-level encryption and security"
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description: "We promote eco-friendly packaging and reduce food waste through smart ordering"
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Our dedicated team is always ready to help with any questions or concerns"
    },
    {
      icon: "📊",
      title: "Transparency",
      description: "Clear pricing, no hidden fees, and real-time order tracking from start to finish"
    },
    {
      icon: "🤝",
      title: "Community First",
      description: "Built by students, for students, with continuous feedback from our campus community"
    },
    {
      icon: "🎓",
      title: "Student-Friendly",
      description: "Special student discounts, loyalty rewards, and flexible payment options"
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Seamless experience across all devices - order from anywhere on campus"
    },
    {
      icon: "🚀",
      title: "Constant Innovation",
      description: "Regular updates with new features based on your feedback and needs"
    }
  ];

  const stats = [
    { number: "5000+", label: "Active Users" },
    { number: "15+", label: "Campus Canteens" },
    { number: "50K+", label: "Orders Completed" },
    { number: "4.8★", label: "Average Rating" }
  ];

  const features = [
    {
      icon: "🍽️",
      title: "Easy Online Ordering",
      description: "Browse diverse menus from all campus canteens in one app. Customize your meals with special instructions and dietary preferences."
    },
    {
      icon: "⏱️",
      title: "Real-Time Tracking",
      description: "Watch your order progress from preparation to completion. Get notified when it's ready for pickup with accurate time estimates."
    },
    {
      icon: "🚀",
      title: "Skip The Queue",
      description: "Place advance orders between classes or schedule meals for later. Walk in and pick up without waiting in line."
    },
    {
      icon: "📍",
      title: "Multi-Location Access",
      description: "Order from any canteen across the university campus. Compare menus and prices to find your perfect meal."
    }
  ];

  const journey = [
    {
      year: "2023",
      title: "The Idea",
      description: "Started as a final year project by CS students frustrated with long canteen queues"
    },
    {
      year: "Early 2024",
      title: "Pilot Launch",
      description: "Partnered with 3 canteens to test the platform with 200 beta users"
    },
    {
      year: "Mid 2024",
      title: "Campus-Wide",
      description: "Expanded to 15+ canteens with over 5000 active users ordering daily"
    },
    {
      year: "2025",
      title: "Future Vision",
      description: "Planning AI-powered meal recommendations and nutritional tracking features"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden"
        style={{ paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div 
            className="inline-block bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6"
            style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            🎓 Made for Japura Students
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            About Japura Eats
          </h1>
          <p className="text-xl md:text-2xl text-red-100 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing campus dining with technology, convenience, and a student-first approach
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="relative z-20"
        style={{ paddingTop: "3rem", paddingBottom: "3rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", marginTop: "-2.5rem" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div 
            className="bg-white rounded-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section 
        style={{ paddingTop: "4rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div 
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg"
              style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
            >
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                To eliminate the frustration of long canteen queues and create a seamless, efficient food ordering experience that respects students' valuable time. We believe every minute saved is a minute you can spend learning, socializing, or simply enjoying campus life.
              </p>
            </div>

            <div 
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg"
              style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
            >
              <div className="text-4xl mb-4">💡</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Why We Started
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                As students ourselves, we experienced the daily struggle of rushing between lectures only to face 30-minute canteen queues. We knew there had to be a better way. Japura Eats was born from this frustration and our passion for solving real campus problems with technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section 
        className="bg-gray-50"
        style={{ paddingTop: "4rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              What We Offer
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need for a hassle-free dining experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section 
        style={{ paddingTop: "4rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Our Journey
            </h2>
            <p className="text-gray-600 text-lg">
              From a simple idea to campus-wide transformation
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-200 hidden md:block"></div>
            
            {journey.map((milestone, index) => (
              <div key={index} className={`mb-12 flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div 
                  style={{ paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
                  className="flex-1"
                >
                  <div 
                    className={`bg-white rounded-xl shadow-lg ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                    style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
                  >
                    <div 
                      className="inline-block bg-red-600 text-white rounded-full text-sm font-semibold mb-3"
                      style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.25rem", paddingBottom: "0.25rem" }}
                    >
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                
                <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 hidden md:flex">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Commitments Interactive Section */}
      <section 
        className="bg-gradient-to-br from-red-50 to-orange-50"
        style={{ paddingTop: "4rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Our 10 Commitments to You
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {commitments.map((commitment, index) => (
              <button
                key={index}
                onClick={() => setActiveCommitment(index)}
                className={`rounded-xl transition-all duration-300 ${
                  activeCommitment === index
                    ? 'bg-red-600 text-white shadow-xl scale-105'
                    : 'bg-white text-gray-700 hover:bg-red-100'
                }`}
                style={{ paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "1rem", paddingRight: "1rem" }}
              >
                <div className="text-3xl mb-2">{commitment.icon}</div>
                <div className="text-sm font-semibold">{commitment.title}</div>
              </button>
            ))}
          </div>

          <div 
            className="bg-white rounded-2xl shadow-xl"
            style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl">{commitments[activeCommitment].icon}</div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {commitments[activeCommitment].title}
                </h3>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {commitments[activeCommitment].description}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        style={{ paddingTop: "4rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Four simple steps to your perfect meal
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", icon: "📱", title: "Browse & Order", desc: "Explore menus and place your order" },
              { step: "2", icon: "👨‍🍳", title: "Kitchen Prepares", desc: "Canteen receives and starts cooking" },
              { step: "3", icon: "🔔", title: "Get Notified", desc: "Receive alert when order is ready" },
              { step: "4", icon: "✨", title: "Pick Up & Enjoy", desc: "Collect your meal and enjoy" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section 
        className="bg-gray-50"
        style={{ paddingTop: "4rem", paddingBottom: "4rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              What Drives Us
            </h2>
            <p className="text-gray-600 text-lg">
              The values behind our innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Student-Centric", 
                icon: "🎓",
                desc: "Every feature is designed with student needs and feedback at the core"
              },
              { 
                title: "Innovation", 
                icon: "💡",
                desc: "We constantly explore new technologies to enhance your experience"
              },
              { 
                title: "Reliability", 
                icon: "⚙️",
                desc: "Dependable service you can count on during the busiest campus days"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
                style={{ paddingTop: "2rem", paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="bg-gradient-to-r from-red-600 to-red-800 text-white"
        style={{ paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Campus Dining?
          </h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of Japura students who are already saving time and enjoying better meals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-red-600 rounded-full font-bold text-lg hover:bg-red-50 transition-colors shadow-xl"
              style={{ paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "1rem", paddingBottom: "1rem" }}
            >
              Download App Now
            </button>
            <button 
              className="bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              style={{ paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "1rem", paddingBottom: "1rem" }}
            >
              Explore Menus
            </button>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section 
        className="bg-gray-900 text-gray-300"
        style={{ paddingTop: "3rem", paddingBottom: "3rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg leading-relaxed">
            Japura Eats is more than just a food ordering platform — it's a community-driven solution built to make campus life easier, one meal at a time. We're committed to continuous improvement and innovation, always listening to your feedback to serve you better.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Made with ❤️ by students, for students at University of Sri Jayewardenepura
          </div>
        </div>
      </section>
    </div>
  );
}
