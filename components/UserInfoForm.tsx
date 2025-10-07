import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Building2, 
  Dna,
  Info,
  AlertCircle
} from "lucide-react";

export interface UserInfo {
  name: string;
  institution: string;
  gender: 'Laki-laki' | 'Perempuan' | '';
  geneticProfile: {
    rs9939609: boolean;  // FTO - Obesitas
    rs7903146: boolean;  // TCF7L2 - Diabetes Melitus Tipe 2
    rs1801282: boolean;  // PPARG - Gangguan metabolisme lemak
    rs662799: boolean;   // APOA5 - Trigliserida tinggi
    rs5219: boolean;     // KCNJ11 - Resistensi insulin
    rs2943641: boolean;  // IRS1 - Resistensi insulin
  };
}

interface UserInfoFormProps {
  onComplete: (userInfo: UserInfo) => void;
  onBack: () => void;
}

const geneticSNPs = [
  {
    id: 'rs9939609',
    name: 'rs9939609 (FTO)',
    risk: 'Obesitas',
    severity: 'Sangat kuat',
    points: 16,
    description: 'Gen resiko obesitas yang sangat kuat'
  },
  {
    id: 'rs7903146',
    name: 'rs7903146 (TCF7L2)',
    risk: 'Diabetes Melitus Tipe 2',
    severity: 'Kuat',
    points: 12,
    description: 'Gen resiko diabetes tipe 2'
  },
  {
    id: 'rs1801282',
    name: 'rs1801282 (PPARG)',
    risk: 'Gangguan metabolisme lemak',
    severity: 'Sedang',
    points: 10,
    description: 'Gen yang mempengaruhi metabolisme lemak'
  },
  {
    id: 'rs662799',
    name: 'rs662799 (APOA5)',
    risk: 'Trigliserida tinggi',
    severity: 'Sedang',
    points: 8,
    description: 'Gen yang mempengaruhi kadar trigliserida'
  },
  {
    id: 'rs5219',
    name: 'rs5219 (KCNJ11)',
    risk: 'Resistensi insulin',
    severity: 'Ringan',
    points: 7,
    description: 'Gen yang mempengaruhi resistensi insulin'
  },
  {
    id: 'rs2943641',
    name: 'rs2943641 (IRS1)',
    risk: 'Resistensi insulin',
    severity: 'Ringan',
    points: 7,
    description: 'Gen yang mempengaruhi sensitivitas insulin'
  }
];

export function UserInfoForm({ onComplete, onBack }: UserInfoFormProps) {
  const [step, setStep] = useState<'basic' | 'genetic'>('basic');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan' | ''>('');
  const [showGeneticInfo, setShowGeneticInfo] = useState(false);
  
  const [geneticProfile, setGeneticProfile] = useState({
    rs9939609: false,
    rs7903146: false,
    rs1801282: false,
    rs662799: false,
    rs5219: false,
    rs2943641: false
  });

  const handleGeneticToggle = (snpId: string) => {
    setGeneticProfile(prev => ({
      ...prev,
      [snpId]: !prev[snpId as keyof typeof prev]
    }));
  };

  const calculateGeneticScore = () => {
    let score = 0;
    geneticSNPs.forEach(snp => {
      if (geneticProfile[snp.id as keyof typeof geneticProfile]) {
        score += snp.points;
      }
    });
    return score;
  };

  const handleBasicNext = () => {
    if (name && institution && gender) {
      setStep('genetic');
    }
  };

  const handleComplete = () => {
    onComplete({
      name,
      institution,
      gender,
      geneticProfile
    });
  };

  const handleSkipGenetic = () => {
    onComplete({
      name,
      institution,
      gender,
      geneticProfile: {
        rs9939609: false,
        rs7903146: false,
        rs1801282: false,
        rs662799: false,
        rs5219: false,
        rs2943641: false
      }
    });
  };

  const isBasicFormValid = name && institution && gender;
  const geneticScore = calculateGeneticScore();

  if (step === 'basic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-4 sm:py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button 
            variant="outline" 
            onClick={onBack}
            size="sm"
            className="mb-4 border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white text-xs sm:text-sm"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Kembali</span>
          </Button>

          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-[#DC143C] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#DC143C] mb-2 px-2">
              D-FENSE - INFORMASI PESERTA
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 px-2">
              Platform web untuk skrining risiko metabolik berbasis nutrigenomik
            </p>
          </div>

          <Card className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm border-2 sm:border-4 border-[#F75270]">
            <div className="space-y-4 sm:space-y-6">
              {/* Name Input */}
              <div>
                <Label htmlFor="name" className="text-[#DC143C] flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Nama Lengkap *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-[#F7CAC9] focus:border-[#DC143C] text-sm sm:text-base"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              {/* Institution Input */}
              <div>
                <Label htmlFor="institution" className="text-[#DC143C] flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  Instansi/Universitas *
                </Label>
                <Input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="border-2 border-[#F7CAC9] focus:border-[#DC143C] text-sm sm:text-base"
                  placeholder="Contoh: Universitas Pertahanan Republik Indonesia"
                />
              </div>

              {/* Gender Selection */}
              <div>
                <Label className="text-[#DC143C] mb-3 block text-sm sm:text-base">
                  Jenis Kelamin *
                </Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value as 'Laki-laki' | 'Perempuan')}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                >
                  <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-[#F7CAC9] hover:border-[#DC143C] hover:bg-[#F7CAC9]/20 transition-all">
                    <RadioGroupItem 
                      value="Laki-laki" 
                      id="male"
                      className="border-[#DC143C] text-[#DC143C]"
                    />
                    <Label htmlFor="male" className="flex-1 cursor-pointer text-gray-700 text-sm sm:text-base">
                      👨 Laki-laki
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-[#F7CAC9] hover:border-[#DC143C] hover:bg-[#F7CAC9]/20 transition-all">
                    <RadioGroupItem 
                      value="Perempuan" 
                      id="female"
                      className="border-[#DC143C] text-[#DC143C]"
                    />
                    <Label htmlFor="female" className="flex-1 cursor-pointer text-gray-700 text-sm sm:text-base">
                      👩 Perempuan
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Alert className="bg-[#FDEBD0]/50 border-2 border-[#F75270]">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-[#DC143C]" />
                <AlertDescription className="text-gray-700 text-xs sm:text-sm">
                  Data Anda akan digunakan untuk personalisasi hasil skrining dan tetap dijaga kerahasiaannya.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleBasicNext}
                disabled={!isBasicFormValid}
                className="w-full bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3"
              >
                <span className="hidden sm:inline">Lanjut ke Profil Genetik</span>
                <span className="sm:hidden">Lanjut</span>
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Genetic Profile Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => setStep('basic')}
          size="sm"
          className="mb-4 border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white text-xs sm:text-sm"
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Kembali
        </Button>

        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-[#DC143C] to-[#F75270] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Dna className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#DC143C] mb-2 px-2">
            PROFIL GENETIK SNP (OPSIONAL)
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto px-2">
            Jika Anda memiliki data tes genetik SNP, pilih varian yang terdeteksi untuk analisis lebih akurat
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#FDEBD0] mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#DC143C] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-[#DC143C] mb-2">Tentang SNP Genotyping</h3>
              <p className="text-sm text-gray-700 mb-3">
                Single Nucleotide Polymorphism (SNP) adalah variasi genetik yang mempengaruhi risiko metabolik Anda. 
                <button 
                  onClick={() => setShowGeneticInfo(!showGeneticInfo)}
                  className="text-[#F75270] hover:text-[#DC143C] ml-1 underline"
                >
                  {showGeneticInfo ? 'Sembunyikan detail' : 'Lihat detail'}
                </button>
              </p>
              
              {showGeneticInfo && (
                <div className="bg-[#FDEBD0]/50 p-4 rounded-lg text-sm space-y-2">
                  <p className="text-gray-700">
                    <strong>Genetik (60%):</strong> Faktor bawaan yang mempengaruhi predisposisi metabolik
                  </p>
                  <p className="text-gray-700">
                    <strong>Lifestyle (40%):</strong> Faktor gaya hidup yang dapat Anda modifikasi
                  </p>
                  <p className="text-[#DC143C] font-semibold mt-3">
                    ⚠️ Jika Anda belum melakukan tes genetik, lewati langkah ini. Skrining tetap akurat berdasarkan faktor lifestyle.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Genetic SNP Selection */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm border-4 border-[#F75270] mb-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#DC143C] mb-2">
              Pilih SNP yang Terdeteksi (jika ada)
            </h3>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#DC143C] text-white">
                Skor Genetik: {geneticScore}/60 poin
              </Badge>
              <span className="text-sm text-gray-600">
                {Object.values(geneticProfile).filter(Boolean).length} varian dipilih
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {geneticSNPs.map((snp) => (
              <div
                key={snp.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  geneticProfile[snp.id as keyof typeof geneticProfile]
                    ? 'bg-[#F7CAC9]/30 border-[#DC143C]'
                    : 'bg-white border-[#F7CAC9] hover:border-[#F75270]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={snp.id}
                    checked={geneticProfile[snp.id as keyof typeof geneticProfile]}
                    onCheckedChange={() => handleGeneticToggle(snp.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={snp.id} className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#DC143C]">{snp.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            snp.severity === 'Sangat kuat' ? 'border-red-500 text-red-600' :
                            snp.severity === 'Kuat' ? 'border-orange-500 text-orange-600' :
                            snp.severity === 'Sedang' ? 'border-yellow-500 text-yellow-600' :
                            'border-blue-500 text-blue-600'
                          }`}
                        >
                          {snp.points} poin
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>Gen Resiko:</strong> {snp.risk}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{snp.description}</p>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSkipGenetic}
            variant="outline"
            className="flex-1 border-[#F75270] text-[#F75270] hover:bg-[#F75270] hover:text-white"
          >
            Lewati (Hanya Lifestyle)
          </Button>
          
          <Button
            onClick={handleComplete}
            className="flex-1 bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white"
          >
            Mulai Skrining
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-[#DC143C] to-[#F75270] text-white">
          <h3 className="font-bold mb-3">📋 RINGKASAN DATA ANDA</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-90">Nama: <strong>{name}</strong></p>
              <p className="opacity-90">Instansi: <strong>{institution}</strong></p>
              <p className="opacity-90">Jenis Kelamin: <strong>{gender}</strong></p>
            </div>
            <div>
              <p className="opacity-90">
                Profil Genetik: <strong>{Object.values(geneticProfile).filter(Boolean).length > 0 ? `${Object.values(geneticProfile).filter(Boolean).length} SNP` : 'Tidak ada'}</strong>
              </p>
              {geneticScore > 0 && (
                <p className="opacity-90">
                  Skor Genetik Awal: <strong>{geneticScore}/60 poin</strong>
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
