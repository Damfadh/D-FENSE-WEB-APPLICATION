import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  AlertTriangle, 
  CheckCircle, 
  Heart, 
  Apple, 
  Activity, 
  Download, 
  Share2,
  ArrowLeft,
  Target,
  Lightbulb,
  Calendar,
  PlayCircle,
  Dna,
  User
} from "lucide-react";
import { UserInfo } from "./UserInfoForm";

interface RiskResultsProps {
  score: number;
  geneticScore: number;
  lifestyleScore: number;
  answers: Record<number, string>;
  userInfo: UserInfo;
  onRestart: () => void;
  onBack: () => void;
  onStartProgram: () => void;
}

interface RiskCategory {
  level: 'low' | 'medium' | 'high';
  label: string;
  color: string;
  bgColor: string;
  icon: any;
  description: string;
  recommendations: string[];
}

const getRiskCategory = (score: number): RiskCategory => {
  if (score <= 20) {
    return {
      level: 'low',
      label: 'RISIKO RENDAH',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      description: 'Selamat! Profil metabolik Anda menunjukkan risiko rendah untuk gangguan metabolik.',
      recommendations: [
        'Pertahankan pola makan seimbang dengan 5 porsi sayur/buah per hari',
        'Lanjutkan aktivitas fisik minimal 150 menit per minggu',
        'Lakukan skrining kesehatan rutin setiap tahun',
        'Jaga berat badan ideal dengan BMI 18.5-24.9',
        'Hindari merokok dan batasi konsumsi alkohol'
      ]
    };
  } else if (score <= 39) {
    return {
      level: 'medium',
      label: 'RISIKO SEDANG',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      icon: AlertTriangle,
      description: 'Anda memiliki beberapa faktor risiko yang perlu diperhatikan dan dimodifikasi.',
      recommendations: [
        'Kurangi konsumsi makanan olahan dan tinggi gula',
        'Tingkatkan aktivitas fisik menjadi 30 menit setiap hari',
        'Konsultasi dengan ahli gizi untuk perencanaan diet',
        'Monitor tekanan darah dan gula darah secara berkala',
        'Kelola stress dengan teknik relaksasi atau meditasi'
      ]
    };
  } else {
    return {
      level: 'high',
      label: 'RISIKO TINGGI',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: AlertTriangle,
      description: 'Profil Anda menunjukkan risiko tinggi. Diperlukan intervensi segera dan monitoring ketat.',
      recommendations: [
        'SEGERA konsultasi dengan dokter untuk pemeriksaan lanjutan',
        'Lakukan tes laboratorium: gula darah puasa, profil lipid, HbA1c',
        'Mulai diet rendah karbohidrat dan lemak jenuh',
        'Program olahraga terpantau dengan intensitas bertahap',
        'Pertimbangkan konseling nutrigenomik untuk pendekatan personal'
      ]
    };
  }
};

export function RiskResults({ score, geneticScore, lifestyleScore, answers, userInfo, onRestart, onBack, onStartProgram }: RiskResultsProps) {
  const riskCategory = getRiskCategory(score);
  const IconComponent = riskCategory.icon;
  
  // Calculate percentage for visual representation
  const percentage = Math.min((score / 60) * 100, 100);

  const generatePersonalizedPlan = () => {
    const plans = {
      nutrition: [],
      exercise: [],
      lifestyle: []
    };

    // Personalized recommendations based on answers
    if (answers[7] === 'Jarang (&lt;1 porsi)') {
      plans.nutrition.push('Tingkatkan konsumsi sayur dan buah secara bertahap hingga 5 porsi/hari');
    }
    
    if (answers[8] === 'Tidak pernah') {
      plans.exercise.push('Mulai dengan jalan kaki 10 menit/hari, tingkatkan bertahap');
    }
    
    if (answers[11] === '&gt;4 kali') {
      plans.nutrition.push('Kurangi makanan cepat saji menjadi maksimal 1x per minggu');
    }

    if (answers[10] === 'Ya, rutin') {
      plans.lifestyle.push('Program berhenti merokok dengan dukungan profesional');
    }

    return plans;
  };

  const personalPlan = generatePersonalizedPlan();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
            HASIL SKRINING METABOLIK
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 px-2">
            Analisis berdasarkan 15 parameter kesehatan Anda
          </p>
        </div>

        {/* User Info Card */}
        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm border-2 border-[#FDEBD0] mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-bold text-[#DC143C] mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                INFORMASI PESERTA
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <strong>Nama:</strong> {userInfo.name}
                </p>
                <p className="text-gray-700">
                  <strong>Instansi:</strong> {userInfo.institution}
                </p>
                <p className="text-gray-700">
                  <strong>Jenis Kelamin:</strong> {userInfo.gender}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-[#DC143C] mb-3 flex items-center gap-2">
                <Dna className="h-5 w-5" />
                BREAKDOWN SKOR
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Skor Genetik (60%)</span>
                    <span className="font-bold text-[#F75270]">{geneticScore}/60</span>
                  </div>
                  <Progress value={(geneticScore / 60) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Skor Lifestyle (40%)</span>
                    <span className="font-bold text-[#DC143C]">{lifestyleScore}/60</span>
                  </div>
                  <Progress value={(lifestyleScore / 60) * 100} className="h-2" />
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-700">Total Skor</span>
                    <span className="font-bold text-[#DC143C]">{score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Result Card */}
        <Card className={`p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 ${riskCategory.bgColor} border-2 sm:border-4 transform hover:scale-[1.02] transition-all`}>
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-4">
              <div className={`p-3 sm:p-4 rounded-full ${riskCategory.level === 'low' ? 'bg-green-500' : riskCategory.level === 'medium' ? 'bg-orange-500' : 'bg-red-500'}`}>
                <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${riskCategory.color}`}>
                  {riskCategory.label}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">
                  Skor: {score}/100
                </p>
              </div>
            </div>
            
            <Progress 
              value={percentage} 
              className="h-3 sm:h-4 mb-3 sm:mb-4"
            />
            
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto px-2">
              {riskCategory.description}
            </p>
          </div>

          {/* Risk Level Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className={`p-4 rounded-lg border-2 ${score <= 20 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-200'}`}>
              <div className="text-center">
                <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${score <= 20 ? 'text-green-600' : 'text-gray-400'}`} />
                <h3 className="font-bold text-green-600">RENDAH</h3>
                <p className="text-sm text-gray-600">0-20 poin</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${score > 20 && score <= 39 ? 'bg-orange-100 border-orange-300' : 'bg-gray-100 border-gray-200'}`}>
              <div className="text-center">
                <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${score > 20 && score <= 39 ? 'text-orange-600' : 'text-gray-400'}`} />
                <h3 className="font-bold text-orange-600">SEDANG</h3>
                <p className="text-sm text-gray-600">21-39 poin</p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${score >= 40 ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-200'}`}>
              <div className="text-center">
                <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${score >= 40 ? 'text-red-600' : 'text-gray-400'}`} />
                <h3 className="font-bold text-red-600">TINGGI</h3>
                <p className="text-sm text-gray-600">≥40 poin</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Genetic Profile Card (if applicable) */}
        {geneticScore > 0 && (
          <Card className="p-6 bg-gradient-to-br from-[#DC143C] to-[#F75270] text-white mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Dna className="h-6 w-6" />
              <h3 className="text-xl font-bold">PROFIL GENETIK SNP ANDA</h3>
            </div>
            <p className="mb-4 text-sm opacity-90">
              Varian genetik yang terdeteksi dan berkontribusi pada risiko metabolik Anda:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {userInfo.geneticProfile.rs9939609 && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="font-semibold">rs9939609 (FTO)</p>
                  <p className="text-sm opacity-90">Obesitas - 16 poin</p>
                </div>
              )}
              {userInfo.geneticProfile.rs7903146 && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="font-semibold">rs7903146 (TCF7L2)</p>
                  <p className="text-sm opacity-90">Diabetes Tipe 2 - 12 poin</p>
                </div>
              )}
              {userInfo.geneticProfile.rs1801282 && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="font-semibold">rs1801282 (PPARG)</p>
                  <p className="text-sm opacity-90">Gangguan Metabolisme Lemak - 10 poin</p>
                </div>
              )}
              {userInfo.geneticProfile.rs662799 && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="font-semibold">rs662799 (APOA5)</p>
                  <p className="text-sm opacity-90">Trigliserida Tinggi - 8 poin</p>
                </div>
              )}
              {userInfo.geneticProfile.rs5219 && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="font-semibold">rs5219 (KCNJ11)</p>
                  <p className="text-sm opacity-90">Resistensi Insulin - 7 poin</p>
                </div>
              )}
              {userInfo.geneticProfile.rs2943641 && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="font-semibold">rs2943641 (IRS1)</p>
                  <p className="text-sm opacity-90">Resistensi Insulin - 7 poin</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-white/30">
              <p className="text-sm">
                💡 <strong>Catatan:</strong> Meskipun Anda memiliki predisposisi genetik, faktor lifestyle (40%) tetap dapat Anda kendalikan untuk menurunkan risiko!
              </p>
            </div>
          </Card>
        )}

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* General Recommendations */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#F75270]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#DC143C] p-2 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#DC143C]">REKOMENDASI UMUM</h3>
            </div>
            
            <div className="space-y-3">
              {riskCategory.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-[#F7CAC9]/30 rounded-lg">
                  <Badge className="bg-[#F75270] text-white mt-1 min-w-fit">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Personalized Action Plan */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#FDEBD0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#F75270] p-2 rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#DC143C]">RENCANA PERSONAL</h3>
            </div>

            {/* Nutrition Plan */}
            {personalPlan.nutrition.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Apple className="h-5 w-5 text-[#DC143C]" />
                  <h4 className="font-semibold text-[#DC143C]">Nutrisi</h4>
                </div>
                <div className="space-y-2">
                  {personalPlan.nutrition.map((plan, index) => (
                    <p key={index} className="text-sm text-gray-700 bg-[#FDEBD0]/50 p-2 rounded">
                      • {plan}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Plan */}
            {personalPlan.exercise.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-[#DC143C]" />
                  <h4 className="font-semibold text-[#DC143C]">Aktivitas Fisik</h4>
                </div>
                <div className="space-y-2">
                  {personalPlan.exercise.map((plan, index) => (
                    <p key={index} className="text-sm text-gray-700 bg-[#FDEBD0]/50 p-2 rounded">
                      • {plan}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle Plan */}
            {personalPlan.lifestyle.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-[#DC143C]" />
                  <h4 className="font-semibold text-[#DC143C]">Gaya Hidup</h4>
                </div>
                <div className="space-y-2">
                  {personalPlan.lifestyle.map((plan, index) => (
                    <p key={index} className="text-sm text-gray-700 bg-[#FDEBD0]/50 p-2 rounded">
                      • {plan}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Default message if no personalized plans */}
            {personalPlan.nutrition.length === 0 && personalPlan.exercise.length === 0 && personalPlan.lifestyle.length === 0 && (
              <p className="text-gray-600 bg-[#FDEBD0]/50 p-4 rounded-lg">
                Profil Anda menunjukkan pola yang baik. Lanjutkan kebiasaan sehat yang sudah ada!
              </p>
            )}
          </Card>
        </div>

        {/* Next Steps Alert */}
        <Alert className="mb-8 border-2 border-[#F75270] bg-white/95">
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Langkah Selanjutnya:</strong> Hasil ini adalah skrining awal berbasis kuisioner. 
            Untuk analisis yang lebih akurat, pertimbangkan tes genetik SNP dan konsultasi dengan tenaga kesehatan profesional.
            {riskCategory.level === 'high' && (
              <span className="block mt-2 text-red-600 font-semibold">
                ⚠️ Dengan risiko tinggi, disarankan untuk segera melakukan pemeriksaan medis lengkap.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Start 3-Day Program CTA */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-[#DC143C] to-[#F75270] text-white border-4 border-[#DC143C]">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">🎯 SIAP MULAI PERUBAHAN?</h3>
            <p className="mb-6 text-lg">
              Ikuti program 3 hari dengan panduan harian yang disesuaikan untuk tingkat risiko Anda!
            </p>
            <Button
              onClick={onStartProgram}
              className="bg-white text-[#DC143C] hover:bg-[#FDEBD0] text-lg px-8 py-4 shadow-lg transform hover:scale-105 transition-all"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              MULAI PROGRAM 3 HARI
            </Button>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={onRestart}
            className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white"
          >
            <Target className="mr-2 h-4 w-4" />
            Tes Ulang
          </Button>
          
          <Button
            variant="outline"
            className="border-[#F75270] text-[#F75270] hover:bg-[#F75270] hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Unduh Hasil PDF
          </Button>
          
          <Button
            variant="outline"
            className="border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Bagikan Hasil
          </Button>
        </div>

        {/* D-FENSE Info */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-gradient-to-r from-[#DC143C] to-[#F75270] text-white">
            <h3 className="text-2xl font-bold mb-2">🛡️ D-FENSE Blueprint</h3>
            <p className="mb-4">
              Inisiatif inovatif Universitas Pertahanan Republik Indonesia untuk kesehatan metabolik berbasis nutrigenomik
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white">
                🎯 Preventif
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                🔬 Berbasis SNP
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                🌍 Inklusif 3T
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}