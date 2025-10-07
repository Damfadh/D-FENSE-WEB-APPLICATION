import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, User } from "lucide-react";
import { UserInfo } from "./UserInfoForm";

interface Question {
  id: number;
  question: string;
  type: 'text' | 'radio' | 'number' | 'waist';
  section?: string;
  options?: string[];
  scoring?: { [key: string]: number };
  reference?: string;
}

const questions: Question[] = [
  // Section I: Klinis dan Riwayat Keluarga (Genetik/Fisiologis)
  {
    id: 1,
    question: "Apakah salah satu Orang Tua atau Saudara Kandung Anda didiagnosis menderita Diabetes Melitus Tipe 2?",
    type: 'radio',
    section: 'I. Klinis dan Riwayat Keluarga',
    options: ['Ya, Keduanya', 'Ya, Salah Satu', 'Tidak Tahu/Tidak Ada'],
    scoring: {
      'Ya, Keduanya': 4,
      'Ya, Salah Satu': 2,
      'Tidak Tahu/Tidak Ada': 0
    },
    reference: 'FINDRISC'
  },
  {
    id: 2,
    question: "Berapakah Lingkar Pinggang Anda?",
    type: 'waist',
    section: 'I. Klinis dan Riwayat Keluarga',
    options: [], // Will be generated based on gender
    scoring: {}, // Will be calculated based on gender
    reference: 'IDF Criteria'
  },
  {
    id: 3,
    question: "Apakah Anda pernah didiagnosis Hipertensi (Darah Tinggi), atau sedang mengonsumsi obat untuk tekanan darah/kolesterol tinggi?",
    type: 'radio',
    section: 'I. Klinis dan Riwayat Keluarga',
    options: ['Ya, salah satu/keduanya', 'Tidak'],
    scoring: {
      'Ya, salah satu/keduanya': 3,
      'Tidak': 0
    },
    reference: 'FINDRISC, NCEP ATP III'
  },
  
  // Section II: Nutrigenomik Perilaku
  {
    id: 4,
    question: "Seberapa sering Anda mengalami rasa kantuk/lesu yang signifikan dalam 1–2 jam setelah mengonsumsi makanan dominan karbohidrat (nasi, mi, roti)?",
    type: 'radio',
    section: 'II. Nutrigenomik Perilaku',
    options: ['Hampir selalu (setiap hari)', 'Sering (3–5 kali/minggu)', 'Jarang/Tidak pernah'],
    scoring: {
      'Hampir selalu (setiap hari)': 4,
      'Sering (3–5 kali/minggu)': 2,
      'Jarang/Tidak pernah': 0
    },
    reference: 'Post-Meal Fatigue (SNP TCF7L2/KCNJ11)'
  },
  {
    id: 5,
    question: "Setelah makan utama, seberapa sering Anda merasa lapar lagi atau mencari camilan <2 jam?",
    type: 'radio',
    section: 'II. Nutrigenomik Perilaku',
    options: ['Hampir selalu (setiap hari)', 'Kadang-kadang (2–4 kali/minggu)', 'Jarang/Tidak pernah'],
    scoring: {
      'Hampir selalu (setiap hari)': 4,
      'Kadang-kadang (2–4 kali/minggu)': 2,
      'Jarang/Tidak pernah': 0
    },
    reference: 'Satiety Control (SNP FTO)'
  },
  {
    id: 6,
    question: "Seberapa sering Anda mengonsumsi gorengan dengan minyak keruh/hitam/dipakai berulang (misal jajanan pinggir jalan)?",
    type: 'radio',
    section: 'II. Nutrigenomik Perilaku',
    options: ['>3 kali/minggu', '1–2 kali/minggu', 'Hampir tidak pernah'],
    scoring: {
      '>3 kali/minggu': 3,
      '1–2 kali/minggu': 1,
      'Hampir tidak pernah': 0
    },
    reference: 'RHCO - Oxidized Fat (SNP APOA5/PPARG)'
  },
  {
    id: 7,
    question: "Seberapa sering Anda mengonsumsi minuman manis (soda, teh kemasan, boba, kopi manis kemasan)?",
    type: 'radio',
    section: 'II. Nutrigenomik Perilaku',
    options: ['Setiap hari/Hampir setiap hari', '1–3 kali/minggu', 'Jarang/Tidak pernah'],
    scoring: {
      'Setiap hari/Hampir setiap hari': 3,
      '1–3 kali/minggu': 1,
      'Jarang/Tidak pernah': 0
    },
    reference: 'WHO-STEPS'
  },
  {
    id: 8,
    question: "Berapa porsi sayur/buah per hari? (1 porsi = 1 mangkuk sayur/1 buah utuh)",
    type: 'radio',
    section: 'II. Nutrigenomik Perilaku',
    options: ['0–1 porsi', '2–3 porsi', '>4 porsi (memenuhi target)'],
    scoring: {
      '0–1 porsi': 3,
      '2–3 porsi': 1,
      '>4 porsi (memenuhi target)': 0
    },
    reference: 'WHO-STEPS'
  },
  
  // Section III: Gaya Hidup dan Lingkungan
  {
    id: 9,
    question: "Berapa lama total waktu Anda duduk/berbaring (di luar tidur) per hari?",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['>8 jam', '4–8 jam', '<4 jam'],
    scoring: {
      '>8 jam': 3,
      '4–8 jam': 1,
      '<4 jam': 0
    },
    reference: 'SBQs (Sedentary Behaviour)'
  },
  {
    id: 10,
    question: "Total menit aktivitas fisik sedang–berat per minggu? (Contoh: jalan cepat, jogging, olahraga, kerja fisik berat)",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['<60 menit', '60–150 menit', '>150 menit (memenuhi target)'],
    scoring: {
      '<60 menit': 3,
      '60–150 menit': 1,
      '>150 menit (memenuhi target)': 0
    },
    reference: 'GPAQ/IPAQ'
  },
  {
    id: 11,
    question: "Rata-rata durasi tidur malam Anda?",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['<6 jam', '6–7 jam', '>7 jam (optimal)'],
    scoring: {
      '<6 jam': 3,
      '6–7 jam': 1,
      '>7 jam (optimal)': 0
    },
    reference: 'NIH/Sleep Foundation'
  },
  {
    id: 12,
    question: "Apakah Anda sering mengalami rasa haus berlebihan dan/atau sering buang air kecil (terutama malam)?",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['Ya, salah satu/keduanya', 'Tidak'],
    scoring: {
      'Ya, salah satu/keduanya': 2,
      'Tidak': 0
    },
    reference: 'Polidipsia/Poliuria'
  },
  {
    id: 13,
    question: "Apakah Anda saat ini merokok aktif (termasuk vape)?",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['Ya', 'Tidak/Mantan perokok'],
    scoring: {
      'Ya': 2,
      'Tidak/Mantan perokok': 0
    },
    reference: 'WHO-STEPS'
  },
  {
    id: 14,
    question: "Berapakah usia Anda?",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['>35 tahun', '18–35 tahun'],
    scoring: {
      '>35 tahun': 2,
      '18–35 tahun': 0
    },
    reference: 'FINDRISC'
  },
  {
    id: 15,
    question: "Apakah pekerjaan utama Anda sangat minim aktivitas fisik? (Contoh: duduk di depan komputer sepanjang hari, kasir, penjaga toko)",
    type: 'radio',
    section: 'III. Gaya Hidup dan Lingkungan',
    options: ['Ya, sangat minim aktivitas fisik', 'Tidak, sering bergerak/aktivitas berat'],
    scoring: {
      'Ya, sangat minim aktivitas fisik': 2,
      'Tidak, sering bergerak/aktivitas berat': 0
    },
    reference: 'GPAQ/WHO'
  }
];

interface MetabolicQuestionnaireProps {
  onComplete: (score: number, answers: Record<number, string>) => void;
  onBack: () => void;
  userInfo: UserInfo | null;
}

export function MetabolicQuestionnaire({ onComplete, onBack, userInfo }: MetabolicQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});



  // Memoize waist circumference options based on gender
  const waistOptions = userInfo?.gender === 'Laki-laki' 
    ? ['Pria >90 cm', 'Pria 80–90 cm', 'Pria <80 cm']
    : ['Wanita >80 cm', 'Wanita 70–80 cm', 'Wanita <70 cm'];

  const getWaistScore = (answer: string) => {
    if (answer.includes('>90') || answer.includes('>80')) return 5;
    if (answer.includes('80–90') || answer.includes('70–80')) return 2;
    return 0;
  };

  const handleAnswer = (value: string) => {
    if (currentQ && currentQ.id) {
      setAnswers(prev => ({
        ...prev,
        [currentQ.id]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1));
    } else {
      // Calculate total score
      let totalScore = 0;
      try {
        questions.forEach(q => {
          const answer = answers[q.id];
          if (answer) {
            if (q.id === 2) { // Waist circumference - special handling
              totalScore += getWaistScore(answer);
            } else if (q.scoring) {
              totalScore += q.scoring[answer] || 0;
            }
          }
        });
        onComplete(totalScore, answers);
      } catch (error) {
        console.error('Error calculating score:', error);
        onComplete(0, answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => Math.max(0, prev - 1));
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id] || '';

  // Safety check
  if (!currentQ || currentQuestion >= questions.length || currentQuestion < 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#DC143C] mb-4">Error Loading Questionnaire</h1>
            <p className="text-gray-700 mb-4">
              Current question: {currentQuestion}, Total questions: {questions.length}
            </p>
            <Button onClick={onBack} className="bg-[#DC143C] text-white">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button - Top Left */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            size="sm"
            className="border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white text-xs sm:text-sm"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Kembali ke Beranda</span>
            <span className="sm:hidden">Kembali</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#DC143C] mb-2 px-2">
            SKRINING RISIKO METABOLIK
          </h1>
          <p className="text-lg text-gray-700">
            Pertanyaan {currentQuestion + 1} dari {questions.length}
          </p>
          
          {userInfo && (
            <div className="mt-4 flex justify-center gap-2">
              <Badge className="bg-[#FDEBD0] text-[#DC143C]">
                <User className="h-3 w-3 mr-1" />
                {userInfo.name}
              </Badge>
              <Badge className="bg-[#F7CAC9] text-[#DC143C]">
                {userInfo.gender}
              </Badge>
              {Object.values(userInfo.geneticProfile).some(v => v) && (
                <Badge className="bg-gradient-to-r from-[#DC143C] to-[#F75270] text-white">
                  🧬 Profil Genetik Aktif
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3 bg-white/50" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Mulai</span>
            <span>{Math.round(progress)}% Selesai</span>
            <span>Hasil</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm border-2 sm:border-4 border-[#F75270] transform hover:scale-[1.02] transition-transform">
          {/* Section Header */}
          {currentQ.section && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-[#FDEBD0] to-[#F7CAC9] rounded-lg">
              <p className="text-xs sm:text-sm font-semibold text-[#DC143C]">
                {currentQ.section}
              </p>
              {currentQ.reference && (
                <p className="text-xs text-gray-600 mt-1">
                  📚 Referensi: {currentQ.reference}
                </p>
              )}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-[#DC143C] to-[#F75270] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
                {currentQuestion + 1}
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#DC143C]">
                {currentQ.question}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {currentQ.type === 'waist' ? (
              <RadioGroup
                value={currentAnswer}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {waistOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-[#F7CAC9] hover:bg-[#F7CAC9]/20 transition-all">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`}
                      className="border-[#DC143C] text-[#DC143C]"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-gray-700 font-medium"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <RadioGroup
                value={currentAnswer}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-transparent hover:border-[#F7CAC9] hover:bg-[#F7CAC9]/20 transition-all">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`}
                      className="border-[#DC143C] text-[#DC143C]"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer text-gray-700 font-medium"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              size="sm"
              className="border-[#F75270] text-[#F75270] hover:bg-[#F75270] hover:text-white disabled:opacity-50 w-full sm:w-auto text-xs sm:text-sm"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Sebelumnya
            </Button>

            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              size="sm"
              className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white disabled:opacity-50 w-full sm:w-auto text-xs sm:text-sm"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Selesai
                </>
              ) : (
                <>
                  Selanjutnya
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Fun Facts Sidebar */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white/80 p-4 rounded-lg border-2 border-[#FDEBD0] transform rotate-1">
            <h4 className="font-bold text-[#DC143C] mb-2">💡 Tahukah Anda?</h4>
            <p className="text-sm text-gray-700">Genetik berkontribusi 60% terhadap risiko metabolik Anda</p>
          </div>
          <div className="bg-white/80 p-4 rounded-lg border-2 border-[#F7CAC9] transform -rotate-1">
            <h4 className="font-bold text-[#DC143C] mb-2">🎯 SNP Analysis</h4>
            <p className="text-sm text-gray-700">Single Nucleotide Polymorphism mempengaruhi respons tubuh terhadap nutrisi</p>
          </div>
          <div className="bg-white/80 p-4 rounded-lg border-2 border-[#F75270] transform rotate-1">
            <h4 className="font-bold text-[#DC143C] mb-2">🔬 Nutrigenomik</h4>
            <p className="text-sm text-gray-700">Ilmu yang mempelajari interaksi gen dengan nutrisi untuk kesehatan optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
}