import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Dna, Heart, Target, Users, Zap, LogIn, UserPlus, X, Info } from "lucide-react";

interface DFenseLandingProps {
  onStartAssessment: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export function DFenseLanding({ onStartAssessment, onSignIn, onSignUp }: DFenseLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270]">
      {/* Top Navigation Bar */}
      <div className="relative z-20 container mx-auto px-4 py-4">
        <div className="flex justify-end items-center gap-2 sm:gap-3">
          <Button
            onClick={onSignIn}
            variant="outline"
            size="sm"
            className="border-2 border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white bg-white/90 backdrop-blur-sm text-xs sm:text-sm"
          >
            <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Masuk</span>
            <span className="sm:hidden">Login</span>
          </Button>
          <Button
            onClick={onSignUp}
            size="sm"
            className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white shadow-lg text-xs sm:text-sm"
          >
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Daftar</span>
            <span className="sm:hidden">Join</span>
          </Button>
        </div>
      </div>

      {/* Hero Section with Postmodern Layout */}
      <div className="relative overflow-hidden -mt-16 pt-16">
        {/* Background Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#DC143C] rounded-full opacity-20 transform rotate-45"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-[#F75270] opacity-30 transform skew-y-12"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-[#DC143C] opacity-25 transform rotate-12"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
          {/* Header with Mixed Typography */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-6">
              <div className="bg-[#DC143C] p-2 sm:p-3 rounded-2xl transform -rotate-12">
                <Dna className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#DC143C] to-[#F75270] bg-clip-text text-transparent">
                D-FENSE
              </h1>
              <div className="bg-[#F75270] px-2 sm:px-3 py-1 sm:py-2 rounded-lg transform rotate-3">
                <span className="text-white text-xs font-bold">WEB APP</span>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl mb-4 text-[#DC143C] font-medium px-2">
                Data-driven Fitness and Evaluation for Nutritional Support and Empowerment
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed px-2">
                <span className="bg-[#F7CAC9] px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">Sistem web inovatif</span> untuk 
                skrining risiko metabolik masyarakat Indonesia melalui pendekatan 
                <span className="bg-[#FDEBD0] px-2 sm:px-3 py-1 rounded-full font-semibold mx-1 sm:mx-2 text-xs sm:text-sm">nutrigenomik berbasis web</span>
                yang terjangkau dan berbasis ilmiah, fokus pada pencegahan diabetes.
              </p>
            </div>
          </div>

          {/* Stats Section with Postmodern Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2">
            <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-2 border-[#F75270] transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-[#DC143C] p-1.5 sm:p-2 rounded-lg">
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-[#DC143C] text-sm sm:text-base">OBESITAS NAIK</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F75270] mb-2">21.8%</p>
              <p className="text-xs sm:text-sm text-gray-600">Prevalensi obesitas dewasa Indonesia (2018)</p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-2 border-[#DC143C] transform rotate-1 hover:rotate-0 transition-transform cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-[#F75270] p-1.5 sm:p-2 rounded-lg">
                  <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-bold text-[#DC143C] text-sm sm:text-base">DIABETES T2</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#DC143C] mb-2">10.9%</p>
              <p className="text-xs sm:text-sm text-gray-600">Peningkatan diagnosis diabetes melitus</p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-2 border-[#F7CAC9] transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-[#F7CAC9] p-1.5 sm:p-2 rounded-lg">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-[#DC143C]" />
                </div>
                <h3 className="font-bold text-[#DC143C] text-sm sm:text-base">KOLESTEROL</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F75270] mb-2">28.8%</p>
              <p className="text-xs sm:text-sm text-gray-600">Kadar kolesterol {'>'}200 mg/dL</p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center px-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border-2 sm:border-4 border-[#F75270] transform hover:scale-105 transition-transform">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#DC143C] mb-3 sm:mb-4">
                🎯 MULAI SKRINING RISIKO METABOLIK
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Dapatkan penilaian risiko personal melalui 15 pertanyaan berbasis ilmiah. 
                Langsung di browser web - tanpa instalasi aplikasi!
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <Badge variant="secondary" className="bg-[#F7CAC9] text-[#DC143C] px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                  ⏱️ 5 Menit
                </Badge>
                <Badge variant="secondary" className="bg-[#FDEBD0] text-[#DC143C] px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                  📊 Hasil Instan
                </Badge>
                <Badge variant="secondary" className="bg-[#F75270] text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                  🌐 Web Based
                </Badge>
              </div>

              <div className="inline-block">
                <Button 
                  onClick={onStartAssessment}
                  className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 rounded-full shadow-lg transform hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">MULAI ASSESSMENT SEKARANG</span>
                  <span className="sm:hidden">MULAI ASSESSMENT</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-[#F7CAC9]">
                <p className="text-xs sm:text-sm text-[#DC143C] font-semibold mb-2">🎯 Demo Akun Tersedia:</p>
                <p className="text-xs text-gray-600">
                  <strong>Email:</strong> demo@dfense.id<br/>
                  <strong>Password:</strong> DemoUser1
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Atau daftar akun baru untuk pengalaman personal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#DC143C] mb-3 sm:mb-4">
              MENGAPA <span className="text-[#F75270]">D-FENSE</span> WEB?
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-700 px-2">Platform web revolusioner untuk pencegahan diabetes dan kesehatan metabolik Indonesia</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-2">
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#F7CAC9] to-[#FDEBD0] rounded-2xl transform hover:rotate-2 transition-transform cursor-pointer">
              <div className="bg-[#DC143C] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Dna className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-bold text-[#DC143C] mb-2 text-sm sm:text-base">BERBASIS SNP</h3>
              <p className="text-xs sm:text-sm text-gray-700">Analisis genetik Single Nucleotide Polymorphism untuk prediksi akurat via web</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#FDEBD0] to-[#F7CAC9] rounded-2xl transform hover:-rotate-2 transition-transform cursor-pointer">
              <div className="bg-[#F75270] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-bold text-[#DC143C] mb-2 text-sm sm:text-base">AKSES UNIVERSAL</h3>
              <p className="text-xs sm:text-sm text-gray-700">Dapat diakses di seluruh Indonesia melalui browser web standar</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#F7CAC9] to-[#F75270] rounded-2xl transform hover:rotate-2 transition-transform cursor-pointer">
              <div className="bg-[#FDEBD0] border-2 border-[#DC143C] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-[#DC143C]" />
              </div>
              <h3 className="font-bold text-[#DC143C] mb-2 text-sm sm:text-base">PREVENTIF</h3>
              <p className="text-xs sm:text-sm text-gray-700">Deteksi dini sebelum gejala klinis muncul, langsung di web</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#F75270] to-[#DC143C] rounded-2xl transform hover:-rotate-2 transition-transform cursor-pointer">
              <div className="bg-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-[#DC143C]" />
              </div>
              <h3 className="font-bold text-white mb-2 text-sm sm:text-base">REAL-TIME</h3>
              <p className="text-xs sm:text-sm text-white">Rekomendasi personal instan berdasarkan algoritma ilmiah</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}