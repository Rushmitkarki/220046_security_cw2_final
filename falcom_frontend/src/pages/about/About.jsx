import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Link } from "react-router-dom";
import Nissan from "../../components/Nissan"; // Ensure correct path

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navbar */}
      <nav className="bg-red-900 fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 hover:bg-red-800">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            WeWheels
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-600 animate-fade-in-down">
          About Us
        </h1>
        <div className="space-y-4 animate-fade-in text-lg">
          <p>
            Welcome to falcom, your trusted partner in automotive excellence.
            Established with a passion for the open road and a commitment to
            quality, falcom has become a beacon for automotive enthusiasts and
            everyday drivers alike. Our mission is simple: to provide top-tier
            automotive products and services that meet the needs of every
            driver, no matter the journey.
          </p>
          <p>
            At falcom, we believe that your vehicle is more than just a means of
            transportation; it's an extension of who you are. That's why we
            offer an extensive selection of high-quality tires, lubricants, and
            accessories that ensure your vehicle performs at its best. Our
            products are sourced from the industry's leading manufacturers,
            guaranteeing reliability, durability, and safety on the road.
          </p>
          <p>
            What sets falcom apart is our unwavering dedication to customer
            satisfaction. We understand that the automotive world can be
            complex, and that's why our team of experts is here to guide you
            every step of the way. Whether you're looking to upgrade your tires,
            find the perfect oil for your engine, or accessorize your vehicle,
            we're here to help you make informed decisions that suit your needs
            and budget.
          </p>
          <p>
            Our commitment to excellence extends beyond our products. At falcom,
            we're driven by innovation and continuously strive to bring you the
            latest in automotive technology and trends. We stay ahead of the
            curve so that you can too, providing you with access to cutting-edge
            products that enhance your driving experience.
          </p>
          <p>
            But falcom is more than just a store – it's a community. We pride
            ourselves on building long-lasting relationships with our customers,
            based on trust, transparency, and mutual respect. When you choose
            WeWheels, you're not just making a purchase; you're joining a family
            of automotive enthusiasts who share your passion for the road.
          </p>
          <p>
            Join our community today and stay connected with the latest trends,
            tips, and exclusive offers. Whether you're a seasoned car enthusiast
            or a new driver, WeWheels is here to support you on every mile of
            your journey.
          </p>
          <p>Thank you for choosing falcom – where your drive begins.</p>
        </div>

        {/* 3D Model Section */}
        <div className="mt-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-600 animate-pulse">
            Check out our 3D model!
          </h2>
          <div className="bg-neutral-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-red-600/50 hover:scale-[1.02]">
            <Canvas style={{ height: "60vh", width: "100%" }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls />
              <Suspense
                fallback={
                  <Html center>
                    <div className="text-red-600 animate-spin">Loading...</div>
                  </Html>
                }
              >
                <Nissan />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
