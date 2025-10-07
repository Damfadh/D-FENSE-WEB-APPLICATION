import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { useTodoProgress } from "./TodoProgressManager";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  Award,
  Target,
  MapPin,
  ChevronRight,
  Trophy
} from "lucide-react";

// Todo Lists for Medium and High Risk (3 Days) - Urban & Rural
const todoListsUrbanMediumHigh = {
  1: {
    urban: [
      "Pagi: 500 ml Air Putih + Teh Hijau Seduh Tanpa Gula + Stretching 5 Menit",
      "Sarapan: Oatmeal (½ porsi) + Buah Beri (sedikit) + 1 Telur Rebus", 
      "Siang: Nasi Merah/Cokelat (½ porsi) + Ikan Tuna/Salmon Panggang + Salad Hijau",
      "Snack: Yoghurt Plain Tanpa Gula + 5 Almond/Kenari",
      "Sore: Jalan Cepat 30 Menit (Treadmill/Taman Kota)",
      "Malam: Sup Bening Ayam Fillet + Sayuran (Tanpa Nasi)",
      "Sebelum tidur: Relaksasi pernapasan + tidur 7-8 jam"
    ],
    rural: [
      "Pagi: 500 ml Air Putih + Air Kunyit Asam Lokal (Tanpa Gula) + Aktivitas Domestik Ringan",
      "Sarapan: Singkong/Ubi Rebus Kecil + 1 Telur Rebus + Daun Kelor Rebus",
      "Siang: Nasi Lokal (½ porsi) + Ikan Air Tawar Bakar/Kukus + Tumis Daun Singkong", 
      "Snack: Kacang Tanah Rebus (½ genggam)",
      "Sore: Kerja Fungsional 30 Menit (berkebun, mencangkul, bantu orang tua)",
      "Malam: Sayur Bening Sederhana + Tempe/Tahu Kukus (Tanpa Nasi)",
      "Sebelum tidur: Relaksasi pernapasan + tidur 7-8 jam"
    ]
  },
  2: {
    urban: [
      "Pagi: Air Putih Hangat + Air Lemon + Jalan Kaki 20 Menit",
      "Sarapan: Roti Gandum (1 lbr) + Telur Orak-Arik (minyak zaitun) + Tomat",
      "Siang: Nasi Merah (½ porsi) + Dada Ayam Panggang + Lalapan & Tomat",
      "Snack: Edamame Rebus (½ genggam)",
      "Sore: Naik-Turun Tangga 10 Menit (atau Box)",
      "Malam: Steak Tahu/Tempe Panggang + Tumis Daun Singkong (Tanpa Nasi)",
      "Sebelum tidur: Meditasi singkat + tidur konsisten 7–8 jam"
    ],
    rural: [
      "Pagi: Air Putih Hangat + Air Jahe Hangat + Jalan Kaki ke Ladang 20 Menit",
      "Sarapan: Jagung Rebus + Tempe Kukus + Sayur Pucuk Ubi",
      "Siang: Nasi Lokal (½ porsi) + Ayam Lokal Bakar/Rebus + Lalapan",
      "Snack: Buah Pisang Lokal (utuh)",
      "Sore: Jalan Kaki ke Ladang/Pasar 20 Menit",
      "Malam: Tumis Sayuran Hijau (sedikit minyak) + Ikan Lokal Kukus (Tanpa Nasi)",
      "Sebelum tidur: Meditasi singkat + tidur konsisten 7–8 jam"
    ]
  },
  3: {
    urban: [
      "Pagi: Air Putih 2 Gelas + Cuka Apel (ACV) 1 sdm + Peregangan Otot Besar",
      "Sarapan: Smoothie Protein (Alpukat, Bayam, Whey/Susu Kedelai) + 5 Almond",
      "Siang: Nasi Merah (½ porsi) + Ikan Salmon/Tenggiri Panggang + Brokoli Rebus",
      "Snack: Buah Pir/Apel Utuh (dengan kulit)",
      "Sore: Latihan Beban Ringan (Dumbbell/Resistance Band) 20 Menit",
      "Malam: Salad Hijau Besar + Ayam Kukus Suwir + Olive Oil Dressing",
      "Sebelum tidur: Hindari layar 30 menit sebelum tidur + relaksasi pernapasan"
    ],
    rural: [
      "Pagi: Air Putih 2 Gelas + Air Lemon & Gula Aren (sangat sedikit) + Peregangan Otot Besar",
      "Sarapan: Sagu/Pisang Rebus + Ikan Kukus + Bayam",
      "Siang: Nasi Lokal (½ porsi) + Tahu/Tempe Kukus + Sayur Asem (tanpa kacang tanah)",
      "Snack: Buah Pepaya/Nanas Lokal",
      "Sore: Aktivitas Fungsional Intensif (Mengangkat Beban/Memindahkan Barang)",
      "Malam: Sayur Rebus + Ayam Lokal Suwir (Rebus/Kukus) (Tanpa Nasi)",
      "Sebelum tidur: Hindari layar 30 menit sebelum tidur + relaksasi pernapasan"
    ]
  }
};

// Todo Lists for Low Risk (3 Days)
const todoListsLowRisk = {
  1: [
    "Pagi: Minum air putih & lakukan peregangan ringan.",
    "Sarapan: Pertahankan sarapan sehat Anda.",
    "Siang: Jaga porsi makan siang seimbang.",
    "Snack: Pilih buah atau camilan sehat.",
    "Sore: Tetap aktif! Jalan santai atau olahraga ringan.",
    "Malam: Makan malam ringan dan sehat.",
    "Sebelum tidur: Ciptakan rutinitas tidur yang baik."
  ],
  2: [
    "Pagi: Awali hari dengan positif dan segelas air.",
    "Sarapan: Variasikan menu sarapan sehat Anda.",
    "Siang: Pastikan ada sayuran dalam makan siang Anda.",
    "Snack: Hindari camilan tinggi gula.",
    "Sore: Lakukan aktivitas yang Anda nikmati.",
    "Malam: Hindari makan berat mendekati waktu tidur.",
    "Sebelum tidur: Relaksasi sejenak sebelum tidur."
  ],
  3: [
    "Pagi: Lakukan peregangan untuk memulai hari.",
    "Sarapan: Jangan lewatkan sarapan.",
    "Siang: Makan siang tepat waktu.",
    "Snack: Coba resep camilan sehat baru.",
    "Sore: Ajak teman atau keluarga untuk aktif bersama.",
    "Malam: Perhatikan asupan garam saat makan malam.",
    "Sebelum tidur: Pastikan kamar tidur nyaman."
  ]
};

interface ThreeDayProgramProps {
  riskLevel: 'low' | 'medium' | 'high';
  onBack: () => void;
}

export function ThreeDayProgram({ riskLevel, onBack }: ThreeDayProgramProps) {
  const [currentDay, setCurrentDay] = useState(1);
  const [location, setLocation] = useState<'urban' | 'rural'>('urban');
  const [showLocationSelect, setShowLocationSelect] = useState(true);
  const [showRecap, setShowRecap] = useState(false);
  
  // Use the new progress manager
  const {
    progress,
    loading,
    updateTaskCompletion,
    getTaskCompletion,
    getDayProgress,
    getOverallProgress
  } = useTodoProgress(riskLevel, location);

  // Get todo list based on risk level and location
  const getTodoList = (day: number) => {
    if (riskLevel === 'low') {
      return todoListsLowRisk[day as keyof typeof todoListsLowRisk] || [];
    } else {
      const dayData = todoListsUrbanMediumHigh[day as keyof typeof todoListsUrbanMediumHigh];
      return dayData ? dayData[location] : [];
    }
  };

  const currentTodos = getTodoList(currentDay);

  // Toggle task completion
  const toggleTask = (taskIndex: number) => {
    const currentValue = getTaskCompletion(currentDay, taskIndex);
    updateTaskCompletion(currentDay, taskIndex, !currentValue);
  };

  // Get completion message
  const getCompletionMessage = () => {
    const completion = getOverallProgress().percentage;
    if (completion >= 80) {
      return {
        title: "LUAR BIASA! 🎉",
        message: "Anda menunjukkan komitmen yang sangat baik! Teruskan pola hidup sehat ini.",
        detailedFeedback: "Pencapaian Anda sangat membanggakan! Dengan tingkat konsistensi seperti ini, Anda sudah membangun fondasi kuat untuk perubahan jangka panjang. Tubuh Anda sudah mulai beradaptasi dengan pola hidup sehat yang baru.",
        suggestions: [
          "🌟 Anda adalah role model! Bagikan pengalaman positif Anda kepada teman dan keluarga",
          "📈 Tingkatkan tantangan dengan menambah durasi atau intensitas aktivitas fisik secara bertahap",
          "🎯 Tetap konsisten - perubahan permanen membutuhkan 8-12 minggu pembiasaan",
          "💚 Jaga momentum! Rayakan setiap pencapaian kecil untuk tetap termotivasi"
        ],
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-300"
      };
    } else if (completion >= 50) {
      return {
        title: "BAGUS SEKALI! 👍",
        message: "Anda sudah melakukan banyak kemajuan. Ini adalah awal yang baik!",
        detailedFeedback: "Selamat! Anda telah menyelesaikan lebih dari setengah program. Ini menunjukkan niat baik dan usaha yang patut diapresiasi. Ingat, perubahan tidak harus sempurna - yang penting adalah konsistensi dan tidak menyerah.",
        suggestions: [
          "💪 Identifikasi tugas yang sering dilewati - apa yang membuatnya sulit? Carilah solusi praktis",
          "⏰ Coba atur reminder di ponsel untuk aktivitas yang sering terlewat",
          "👥 Ajak teman atau keluarga sebagai partner - dukungan sosial sangat membantu!",
          "📝 Buatlah jurnal singkat tentang apa yang membantu Anda berhasil menyelesaikan tugas",
          "🔄 Ulangi program ini dan targetkan peningkatan 10-15% dari pencapaian sebelumnya"
        ],
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300"
      };
    } else if (completion >= 25) {
      return {
        title: "TETAP SEMANGAT! 💪",
        message: "Anda sudah memulai - itu adalah langkah paling penting!",
        detailedFeedback: "Terima kasih sudah mencoba! Memulai itu tidak mudah, dan Anda sudah melakukannya. Jangan berkecil hati - perubahan kebiasaan memang challenging di awal. Yang penting Anda sudah aware dan mau berusaha.",
        suggestions: [
          "🎯 Fokus pada 3 tugas yang paling mudah dilakukan terlebih dahulu - bangun kepercayaan diri!",
          "🔍 Identifikasi hambatan terbesar: waktu, akses, motivasi, atau pengetahuan?",
          "📅 Pilih 1 hari khusus dalam seminggu untuk benar-benar fokus menyelesaikan semua tugas",
          "💬 Ceritakan pada keluarga/teman bahwa Anda sedang program kesehatan - minta dukungan mereka",
          "🌱 Mulai dari yang sangat kecil: bahkan 1 tugas selesai per hari adalah progress!",
          "🔄 Ulangi program - biasanya putaran kedua lebih mudah karena sudah familiar"
        ],
        color: "text-[#DC143C]",
        bgColor: "bg-[#F7CAC9]",
        borderColor: "border-[#F75270]"
      };
    } else {
      return {
        title: "JANGAN MENYERAH! 🌟",
        message: "Perjalanan seribu mil dimulai dengan satu langkah. Anda bisa!",
        detailedFeedback: "Kami memahami bahwa mengubah kebiasaan itu sangat sulit. Mungkin program ini terasa overwhelming atau ada kendala yang belum Anda sadari. Tapi ingat: kegagalan hanyalah feedback. Anda sudah berani memulai, dan itu menunjukkan Anda peduli dengan kesehatan Anda.",
        suggestions: [
          "💙 Jangan judge diri sendiri terlalu keras - self-compassion adalah kunci perubahan berkelanjutan",
          "🔎 Refleksi: Apa yang membuat program ini sulit? Waktu? Akses? Motivasi? Pengetahuan?",
          "🎯 Mulai SANGAT kecil: pilih HANYA 1 kebiasaan (misal: minum air putih pagi hari) dan fokus di sana selama 1 minggu",
          "🗣️ Bicarakan dengan tenaga kesehatan atau konselor - mungkin ada cara yang lebih sesuai dengan kondisi Anda",
          "👨‍👩‍👧‍👦 Libatkan keluarga dalam perubahan - buat ini proyek keluarga, bukan perjuangan sendirian",
          "📖 Edukasi diri tentang MENGAPA kesehatan metabolik penting - motivasi intrinsik lebih kuat dari tekanan",
          "✨ Setiap orang punya timeline berbeda - yang penting TIDAK BERHENTI MENCOBA"
        ],
        color: "text-[#DC143C]",
        bgColor: "bg-[#F7CAC9]",
        borderColor: "border-[#F75270]"
      };
    }
  };

  if (showLocationSelect && riskLevel !== 'low') {
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
            <span className="hidden sm:inline">Kembali ke Hasil</span>
            <span className="sm:hidden">Kembali</span>
          </Button>

          <Card className="p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm border-2 sm:border-4 border-[#F75270]">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-[#DC143C] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#DC143C] mb-2">
                PILIH LOKASI ANDA
              </h2>
              <p className="text-sm sm:text-base text-gray-700 px-2">
                Kami akan menyesuaikan rekomendasi makanan dengan sumber daya yang tersedia di wilayah Anda
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setLocation('urban');
                  setShowLocationSelect(false);
                }}
                className="p-4 sm:p-6 bg-gradient-to-br from-[#F7CAC9] to-[#FDEBD0] rounded-xl border-2 border-transparent hover:border-[#DC143C] transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🏙️</div>
                  <h3 className="font-bold text-[#DC143C] mb-2 text-sm sm:text-base">PERKOTAAN</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Akses ke supermarket, gym, dan bahan makanan modern
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setLocation('rural');
                  setShowLocationSelect(false);
                }}
                className="p-4 sm:p-6 bg-gradient-to-br from-[#FDEBD0] to-[#F7CAC9] rounded-xl border-2 border-transparent hover:border-[#DC143C] transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🌾</div>
                  <h3 className="font-bold text-[#DC143C] mb-2">PEDESAAN (3T)</h3>
                  <p className="text-sm text-gray-700">
                    Bahan lokal, aktivitas fungsional, dan sumber daya tradisional
                  </p>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showRecap) {
    const recap = getCompletionMessage();
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4 border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Hasil
          </Button>

          <Card className={`p-8 ${recap.bgColor} border-4 ${recap.borderColor} mb-8`}>
            <div className="text-center mb-6">
              <div className="bg-[#DC143C] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className={`text-4xl font-bold ${recap.color} mb-4`}>
                {recap.title}
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                {recap.message}
              </p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#DC143C]">Total Pencapaian:</span>
                  <span className="font-bold text-[#DC143C]">{Math.round(getOverallProgress().percentage)}%</span>
                </div>
                <Progress value={getOverallProgress().percentage} className="h-4" />
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="mt-6 p-4 bg-white/70 rounded-lg">
              <p className="text-gray-800 leading-relaxed">
                {recap.detailedFeedback}
              </p>
            </div>
          </Card>

          {/* Daily Breakdown */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(day => {
              const dayProgress = getDayProgress(day);
              return (
                <Card key={day} className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#F7CAC9]">
                  <div className="text-center">
                    <h3 className="font-bold text-[#DC143C] mb-2">HARI {day}</h3>
                    <div className="text-3xl font-bold text-[#F75270] mb-2">
                      {dayProgress.percentage}%
                    </div>
                    <Progress value={dayProgress.percentage} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">
                      {dayProgress.completed} / {getTodoList(day).length} tugas
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Personalized Suggestions */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#FDEBD0] mb-6">
            <h3 className="font-bold text-[#DC143C] mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              SARAN PERSONAL UNTUK ANDA
            </h3>
            <div className="space-y-3">
              {recap.suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="text-gray-700 bg-gradient-to-r from-[#FDEBD0]/50 to-[#F7CAC9]/30 p-4 rounded-lg border-l-4 border-[#DC143C] hover:shadow-md transition-shadow"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </Card>

          {/* General Recommendations */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#FDEBD0]">
            <h3 className="font-bold text-[#DC143C] mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              LANGKAH SELANJUTNYA
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700 bg-[#FDEBD0]/50 p-3 rounded-lg">
                ✅ Ulangi program 3 hari ini selama 8-12 minggu untuk membentuk kebiasaan permanen
              </p>
              <p className="text-gray-700 bg-[#F7CAC9]/30 p-3 rounded-lg">
                📊 Lakukan skrining ulang setiap bulan untuk memantau perkembangan
              </p>
              <p className="text-gray-700 bg-[#FDEBD0]/50 p-3 rounded-lg">
                💪 Tingkatkan intensitas aktivitas fisik secara bertahap
              </p>
              <p className="text-gray-700 bg-[#F7CAC9]/30 p-3 rounded-lg">
                🔬 Pertimbangkan tes genetik SNP untuk rekomendasi yang lebih personal
              </p>
            </div>
          </Card>

          <div className="text-center mt-8">
            <Button
              onClick={() => {
                setShowRecap(false);
                setCurrentDay(1);
                // Progress will be reset via TodoProgressManager
              }}
              className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white"
            >
              🔄 Mulai Program Baru
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDEBD0] via-[#F7CAC9] to-[#F75270] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4 border-[#DC143C] text-[#DC143C] hover:bg-[#DC143C] hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Hasil
        </Button>

        {/* Day Navigation */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(day => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                currentDay === day 
                  ? 'bg-gradient-to-r from-[#DC143C] to-[#F75270] border-[#DC143C] text-white' 
                  : 'bg-white/90 border-[#F7CAC9] text-[#DC143C] hover:border-[#DC143C]'
              }`}
            >
              <div className="text-center">
                <Calendar className={`h-6 w-6 mx-auto mb-2 ${currentDay === day ? 'text-white' : 'text-[#DC143C]'}`} />
                <div className="font-bold">HARI {day}</div>
                <div className="text-sm mt-1">
                  {getDayProgress(day).percentage}% selesai
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Overview */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm border-4 border-[#F75270] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#DC143C]">
                HARI {currentDay} - PROGRAM 3 HARI
              </h2>
              <p className="text-gray-700">
                {riskLevel !== 'low' && (
                  <Badge className="bg-[#FDEBD0] text-[#DC143C] mr-2">
                    {location === 'urban' ? '🏙️ Perkotaan' : '🌾 Pedesaan'}
                  </Badge>
                )}
                {getDayProgress(currentDay).completed} dari {currentTodos.length} tugas selesai
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#F75270]">
                {getDayProgress(currentDay).percentage}%
              </div>
              <div className="text-sm text-gray-600">Progress Hari Ini</div>
            </div>
          </div>
          <Progress value={getDayProgress(currentDay).percentage} className="h-3" />
        </Card>

        {/* Todo List */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm border-2 border-[#FDEBD0] mb-8">
          <h3 className="font-bold text-[#DC143C] mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            DAFTAR AKTIVITAS HARI INI
          </h3>
          
          <div className="space-y-3">
            {currentTodos.map((todo, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                  getTaskCompletion(currentDay, index)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-[#F7CAC9] hover:border-[#DC143C]'
                }`}
              >
                <Checkbox
                  id={`task-${index}`}
                  checked={getTaskCompletion(currentDay, index)}
                  onCheckedChange={() => toggleTask(index)}
                  className="mt-1"
                />
                <label
                  htmlFor={`task-${index}`}
                  className={`flex-1 cursor-pointer ${
                    getTaskCompletion(currentDay, index) 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-700'
                  }`}
                >
                  {todo}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setCurrentDay(prev => Math.max(1, prev - 1))}
            disabled={currentDay === 1}
            variant="outline"
            className="border-[#F75270] text-[#F75270] hover:bg-[#F75270] hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hari Sebelumnya
          </Button>

          {currentDay === 3 ? (
            <Button
              onClick={() => setShowRecap(true)}
              className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Lihat Rekap 3 Hari
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentDay(prev => Math.min(3, prev + 1))}
              className="bg-gradient-to-r from-[#DC143C] to-[#F75270] hover:from-[#F75270] hover:to-[#DC143C] text-white"
            >
              Hari Berikutnya
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tips Card */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-[#DC143C] to-[#F75270] text-white">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            💡 TIPS HARI INI
          </h3>
          <p className="text-sm">
            {currentDay === 1 && "Mulailah dengan langkah kecil. Fokus pada 3 tugas pertama dan bangun momentum!"}
            {currentDay === 2 && "Anda sudah melewati hari pertama! Pertahankan konsistensi dan jangan menyerah."}
            {currentDay === 3 && "Hari terakhir! Tunjukkan komitmen Anda dan selesaikan dengan kuat. Ini akan menjadi kebiasaan baru!"}
          </p>
        </Card>
      </div>
    </div>
  );
}