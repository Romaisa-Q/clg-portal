import { useRouter } from "next/router";
import { Card, CardContent } from "../ui/card";
import Image from "next/image"; 
import { LoginHeader } from "./loginHeader.jsx";
import { LoginForm } from "./loginForm.jsx";
import { COLLEGE_COLORS } from "../constants/colors";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email, password, role) => {
    console.log("Login attempt:", { email, password, role });

    // Role-based navigation
    if (role === "teacher") {
      router.push("/dashboards/teacherDashboard");
    } else if (role === "student") {
      router.push("/dashboards/studentDashboard");
    } else if (role === "administrator") {
      router.push("/dashboards/adminDashboard");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg.jpg" 
          alt="College Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Login Card */}
      <Card className="relative z-10  w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <LoginHeader />
        <CardContent>
          <LoginForm onSubmit={handleLogin} />
        </CardContent>
      </Card>

      {/* Footer */}
     <div className="absolute bottom-20 sm:bottom-2 left-1/2 transform -translate-x-1/2 z-10">
  <p
    className="text-sm text-center"
    style={{ color: COLLEGE_COLORS.lightGray }}
  >
    © 2025 College Portal. All rights reserved.
  </p>
</div>

    </div>
  );
}
