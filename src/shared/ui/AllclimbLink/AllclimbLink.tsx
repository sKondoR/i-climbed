import { ALLCLIMB_URL } from "@/shared/constants/allclimb.constants";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AllclimbLink({ href = '' }: { href: string | null }) {
    return (
        <a href={`${ALLCLIMB_URL}/${href}`} className="ml-3 inline-block cursor-pointer text-blue-700 hover:text-pink-700" target="_blank">
            <FontAwesomeIcon icon={faUpRightFromSquare} />
        </a> 
    );
}

