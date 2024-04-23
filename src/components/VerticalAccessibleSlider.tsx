import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SliderValueLabelProps } from "@mui/material/Slider";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const MIN = 1;
const MAX = 100;

const theme = createTheme({
    palette: {
        primary: {
            main: "#0038A8",
        },
    },
});

interface Props {
    updateSize: (size: number) => void;
    size: number;
}

function VerticalAccessibleSlider({ updateSize, size }: Props) {
    const preventHorizontalKeyboardNavigation = (
        event: React.KeyboardEvent
    ) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    };

    const handleSize = (_event: Event, size: number | number[]) => {
        if (!Array.isArray(size)) {
            updateSize(size);
        }
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ height: 128 }}>
                    <Slider
                        sx={{
                            '& input[type="range"]': {
                                writingMode: "vertical-lr",
                                direction: "rtl",
                            },
                            "& .MuiSlider-thumb": {
                                width: 26, // Change the width of the thumb
                                height: 26, // Change the height of the thumb
                                outline: "2px solid white",
                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
                            },
                        }}
                        slots={{
                            valueLabel: ValueLabelComponent,
                        }}
                        orientation="vertical"
                        value={size}
                        defaultValue={size}
                        aria-label="Temperature"
                        valueLabelDisplay="auto"
                        min={MIN}
                        max={MAX}
                        color="primary"
                        onKeyDown={preventHorizontalKeyboardNavigation}
                        onChange={handleSize}
                    />
                </Box>
            </ThemeProvider>
        </>
    );
}

function ValueLabelComponent(props: SliderValueLabelProps) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="right" title={value}>
            {children}
        </Tooltip>
    );
}

export default VerticalAccessibleSlider;
