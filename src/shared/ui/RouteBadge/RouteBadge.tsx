import { GRADES_COLORS, PROEKT_COLOR } from "@/shared/constants/allclimb.constants";

type IRouteBadge = {
  grade?: string;
  isText?: boolean;
};

const RouteBadge = ({
  grade,
  isText = false,
}: IRouteBadge) => {
  if (!grade) return null;
  const formattedGrade = grade.toLowerCase();
  const bg = GRADES_COLORS[formattedGrade.slice(0, 2)] || PROEKT_COLOR;
  if (isText) {
    return <span className="" style={{ color: bg }}>{formattedGrade}</span>
  }
  return (
    <span className="w-14 h-14 md:w-17 md:h-17 rounded-full text-md md:text-xl inline-block text-center text-white bold pt-4 md:pt-5" style={{ background: bg }}>{formattedGrade}</span>
  );
};

export default RouteBadge;
