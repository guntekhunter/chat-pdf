import Button from "./component/Button";

export default function Home() {
  return (
    <div className="bg-[#F8F8F8] w-full flex justify-center py-[2rem] text-[#0B1215]">
      <div className="w-[70%] bg-white rounded-md px-[3rem] py-[4rem] text-center flex justify-center">
        <div className="w-[60%] space-y-[1rem]">
          <h1 className="font-bold text-[2rem]">Chat Dengan File Pdfmu</h1>
          <p className="text-[.7rem]">
            Dengan bantuan AI dari Chat Pdf Kamu bisa bertanya apapun tentang
            file PDFmu. Buat daftar pustaka dari jurnal, Bertanya tentang CV,
            dan masih banyak lagi.
          </p>
          <div className="w-full bg-gray-200 h-[17rem]"></div>
          <Button>Coba Gratis</Button>
        </div>
      </div>
    </div>
  );
}
