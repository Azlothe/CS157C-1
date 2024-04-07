import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { RgbColorPicker } from "react-colorful";
import {Tool, RGB} from "../types/shared.tsx";

interface Props {
    updateTool: (s: Tool) => void;
    updateColor: (color: RGB) => void;
    color: RGB;
}

function VerticalToolbar({ updateTool, updateColor, color }: Props) {
    const hexColor = rgbToHex(color);

    let isColorPick = false;

    const handleClick = (s: Tool) => {
        if (isColorPick === false && s === "Color Picker") {
            isColorPick = true;
        }
        updateTool(s);
    };

    const handleColor = (color: RGB) => {
        updateColor(color);
    };

    function rgbToHex({ r, g, b }: RGB): string {
        const toHex = (c: number): string => {
            const hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
    
        return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    return (
        <>
            <Toolbar
                sx={{
                    backgroundColor: "rgba(255, 184, 26, 0)",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "64px",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                }}
            >
                <IconButton
                    aria-label="pan"
                    onClick={() => handleClick("Pan")}
                    sx={{
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            backgroundColor: "#c0c0c0",
                            transform: "scale(1.15)",
                            transition: "transform 0.3s ease",
                        },
                        marginBottom: "4px",
                    }}
                >
                    <PanIcon />
                </IconButton>
                <IconButton
                    aria-label="brush"
                    onClick={() => handleClick("Brush")}
                    sx={{
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            backgroundColor: "#c0c0c0",
                            transform: "scale(1.15)",
                            transition: "transform 0.3s ease",
                        },
                        marginBottom: "4px",
                    }}
                >
                    <BrushIcon />
                </IconButton>
                <IconButton
                    aria-label="eraser"
                    onClick={() => handleClick("Eraser")}
                    sx={{
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                            backgroundColor: "#c0c0c0",
                            transform: "scale(1.15)",
                            transition: "transform 0.3s ease",
                        },
                        marginBottom: "4px",
                    }}
                >
                    <EraserIcon />
                </IconButton>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginLeft: "128px",
                    }}
                >
                    <IconButton
                        aria-label="color-picker"
                        onClick={() => handleClick("Color Picker")}
                        sx={{
                            backgroundColor: "white",
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                                backgroundColor: "#c0c0c0",
                                transform: "scale(1.15)",
                                transition: "transform 0.3s ease",
                            },
                            marginBottom: "4px",
                        }}
                    >
                        <ColorPickerIcon hexColor={hexColor} />
                    </IconButton>
                    <RgbColorPicker
                        className="color-picker"
                        color={color}
                        onChange={handleColor}
                        style={{
                            width: "128px",
                            height: "128px",
                            paddingLeft: "6px",
                        }}
                    />
                </div>
            </Toolbar>
        </>
    );
}

const PanIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={32}
        height={32}
        color={"#000000"}
        fill={"none"}
        {...props}
    >
        <path
            d="M18.9154 11.6997L17.373 15.8314C16.6547 17.7556 16.2955 18.7177 15.709 19.377C14.812 20.3851 13.5203 20.9748 12.1549 20.9995C11.262 21.0156 10.2783 20.6665 8.31091 19.9683C7.27913 19.6022 6.76324 19.4191 6.32165 19.1455C5.64795 18.7281 5.09127 18.1534 4.70166 17.4731C4.44628 17.0272 4.28743 16.5137 3.96974 15.4867L2.56985 10.9613C2.35476 10.266 2.64855 9.51553 3.28412 9.13687C4.11475 8.64198 5.19966 8.96175 5.60953 9.82225L6.5443 11.7848L9.1763 4.73429C9.4501 4.00083 10.2819 3.62265 11.0342 3.88961C11.7865 4.15657 12.1743 4.96757 11.9005 5.70103M11.9005 5.70103L12.5616 3.93029C12.8354 3.19683 13.6672 2.81866 14.4194 3.08562C15.1717 3.35257 15.5596 4.16357 15.2858 4.89704L14.6248 6.66777M11.9005 5.70103L10.4132 9.68518M14.6248 6.66777C14.8986 5.93431 15.7304 5.55613 16.4826 5.82309C17.2349 6.09005 17.6228 6.90105 17.349 7.63451L16.688 9.40524M14.6248 6.66777L13.1374 10.6519M18.5859 12.5854L19.4122 10.372C19.686 9.63852 19.2981 8.82752 18.5458 8.56056C17.7936 8.2936 16.9618 8.67178 16.688 9.40524M16.688 9.40524L15.8617 11.6187"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M21.3307 14C21.877 15.6354 21.0574 17.4263 19.5 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

const BrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={32}
        height={32}
        color={"#000000"}
        fill={"none"}
        {...props}
    >
        <path
            d="M7.49478 13.753C10.5833 10.1644 17.5788 3.15478 20.5387 3.00445C22.3699 2.82906 18.7218 9.32547 10.0785 16.4339M11.4581 10.0449L13.7157 12.3249M3 20.8546C3.70948 18.3472 3.26187 19.5794 3.50407 16.6919C3.63306 16.2644 3.89258 14.9377 5.51358 14.2765C7.35618 13.5249 8.70698 14.6611 9.05612 15.195C10.0847 16.3102 10.2039 17.6952 9.05612 19.2774C7.9083 20.8596 4.50352 21.2527 3 20.8546Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const EraserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={32}
        height={32}
        color={"#000000"}
        fill={"none"}
        {...props}
    >
        <path
            d="M8.73792 7.78021L4.84693 11.7574C3.67722 12.953 3.09236 13.5508 3.01263 14.2802C2.99579 14.4343 2.99579 14.5899 3.01263 14.744C3.09236 15.4733 3.67722 16.0711 4.84693 17.2668L4.99601 17.4191C5.62049 18.0575 5.93274 18.3766 6.30638 18.5911C6.5236 18.7157 6.75482 18.8134 6.99505 18.882C7.40827 19 7.85149 19 8.73792 19C9.62436 19 10.0676 19 10.4808 18.882C10.721 18.8134 10.9522 18.7157 11.1695 18.5911C11.5431 18.3766 11.8554 18.0575 12.4798 17.4191L15.3239 14.5121M8.73792 7.78021L12.3199 4.12313C13.7065 2.70754 14.3997 1.99974 15.2627 2C16.1256 2.00026 16.8185 2.70846 18.2042 4.12487L18.9473 4.8845C20.3159 6.28342 21.0002 6.98288 21 7.85008C20.9997 8.71728 20.315 9.41633 18.9456 10.8144L15.3239 14.5121M8.73792 7.78021L15.3239 14.5121"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10 22L21 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ColorPickerIcon = ({
    hexColor,
    ...props
}: { hexColor: string } & React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={32}
        height={32}
        color={hexColor}
        {...props}
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
    </svg>
);

export default VerticalToolbar;
