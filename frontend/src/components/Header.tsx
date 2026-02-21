"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout, loading } = useAuth();

  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-primary-200 transition">
          Greenmart
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-primary-200 transition">
            Home
          </Link>
          <Link href="/seller" className="hover:text-primary-200 transition">
            Sell
          </Link>
          {!loading && (
            <>
              {user ? (
                <>
                  {user.role === "seller" && (
                    <Link href="/seller" className="hover:text-primary-200 transition">
                      My Products
                    </Link>
                  )}
                  <Link href="/admin" className="hover:text-primary-200 transition">
                    Admin
                  </Link>
                  <span className="text-primary-200 font-medium">
                    Hello, {user.full_name}
                  </span>
                  <button
                    onClick={logout}
                    className="hover:text-primary-200 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-primary-200 transition">
                    Login
                  </Link>
                  <Link href="/signup" className="hover:text-primary-200 transition">
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
          <Link
            href="/cart"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg transition"
          >
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="bg-primary-400 text-primary-900 px-2 py-0.5 rounded-full text-sm font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
