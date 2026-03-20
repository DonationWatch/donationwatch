import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import Loading from "@/components/loading/loading";

export default function CountryLoading() {
  return (
    <div className="flex grow flex-col">
      <AbsoluteMultipleColorsGradient
        colors={[{ color: "#3730a3", width: 100 }]}
      />
      <Loading />
    </div>
  );
}
