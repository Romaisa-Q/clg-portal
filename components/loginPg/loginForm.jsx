
import React, { useState } from "react";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, EyeOff, User, Lock, UserCheck } from 'lucide-react';
import { COLLEGE_COLORS } from '../constants/colors';
import { Button } from '../ui/button'; 


export function LoginForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select your role');
      return;
    }
    onSubmit(email, password, role);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Email Address
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#66bb6a] focus:ring-[#66bb6a]"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 border-none top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 border-gray-300 focus:border-[#66bb6a] focus:ring-[#66bb6a]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            style={{ color: COLLEGE_COLORS.lightGreen }}
          >
            {showPassword ? <EyeOff className="w-4 h-4 border-0" /> : <Eye className="w-4 h-4 border-0" />}
          </button>
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="role" style={{ color: COLLEGE_COLORS.darkGreen }}>
          Login As
        </Label>
        <div className="relative">
          <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" style={{ color: COLLEGE_COLORS.lightGreen }} />
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger className="pl-10 border-gray-300 focus:border-[#66bb6a] focus:ring-[#66bb6a]">
              <SelectValue   placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="administrator">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <a href="#" className="text-sm hover:underline" style={{ color: COLLEGE_COLORS.redAccent }}>
          Forgot password?
        </a>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: COLLEGE_COLORS.darkGreen }}
      >
        Login
      </Button>

      {/* Register Link */}
      <div className="text-center ">
        <p className="text-sm" style={{ color: COLLEGE_COLORS.gray }}>
          Don't have an account?{' '}
          <a href="#" className="hover:underline" style={{ color: COLLEGE_COLORS.lightGreen }}>
            Register
          </a>
        </p>
      </div>
    </form>
  );
}