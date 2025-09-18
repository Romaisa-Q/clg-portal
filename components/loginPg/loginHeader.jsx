import Image from "next/image";
import { CardHeader, CardTitle, CardDescription } from "../ui/card";
import { COLLEGE_COLORS } from "../constants/colors";

export function LoginHeader() {
  return (
    <CardHeader className="text-center space-y-4">
      {/* Logo Image */}
      <div
        className="mx-auto w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
      >
        <Image
          src="/images/logo.png"
          alt="College Logo"
          width={86}
          height={86}
          className="object-cover"
        />
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <CardTitle
          className="text-2xl"
          style={{
            color: COLLEGE_COLORS.darkGreen,
            fontFamily: "Montserrat, system-ui, sans-serif",
          }}
        >
          College Portal
        </CardTitle>
        <CardDescription
          className="text-base"
          style={{
            color: COLLEGE_COLORS.gray,
            fontFamily: "Lato, system-ui, sans-serif",
          }}
        >
          Sign in to your account
        </CardDescription>
      </div>
    </CardHeader>
  );
}
