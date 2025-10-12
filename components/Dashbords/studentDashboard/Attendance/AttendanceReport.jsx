"use client";
import ChartsSection from './components/ChartsSection';
import PerformanceAnalysis from './components/PerformanceAnalysis';

export default function AttendanceReport() {
  return (
    <div className="space-y-6">
      <ChartsSection />
      <PerformanceAnalysis />
    </div>
  );
}