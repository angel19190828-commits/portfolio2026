import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    roles: string
    label: string
    fixedWord: string
    interval: number
    roleWidth: number
    fontSize: number
    color: string
}

export default function HeroRoleLoop(props: Props) {
    const {
        roles,
        label,
        fixedWord,
        interval,
        roleWidth,
        fontSize,
        color,
    } = props

    const words = React.useMemo(
        () =>
            roles
                .split(",")
                .map((role) => role.trim())
                .filter(Boolean),
        [roles]
    )

    const [index, setIndex] = React.useState(0)

    React.useEffect(() => {
        if (words.length < 2) return

        const id = window.setInterval(() => {
            setIndex((value) => (value + 1) % words.length)
        }, interval)

        return () => window.clearInterval(id)
    }, [words.length, interval])

    const height = Math.round(fontSize * 1.18)

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                width: "100%",
                color,
                whiteSpace: "nowrap",
            }}
        >
            <span
                style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    lineHeight: "18px",
                    marginRight: 4,
                }}
            >
                {label}
            </span>

            <div
                style={{
                    position: "relative",
                    width: roleWidth,
                    height,
                    overflow: "hidden",
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={words[index] || ""}
                        initial={{ y: 92, opacity: 0, filter: "blur(18px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: -92, opacity: 0, filter: "blur(18px)" }}
                        transition={{
                            duration: 0.68,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            fontFamily: "Georgia, serif",
                            fontSize,
                            lineHeight: `${height}px`,
                            letterSpacing: 0,
                        }}
                    >
                        <span style={{ fontSize: fontSize * 0.48, marginRight: 8 }}>*</span>
                        {words[index]}
                        <span style={{ fontSize: fontSize * 0.48, marginLeft: 8 }}>*</span>
                    </motion.div>
                </AnimatePresence>
            </div>

            <span
                style={{
                    fontFamily: "Georgia, serif",
                    fontSize,
                    lineHeight: `${height}px`,
                    letterSpacing: 0,
                }}
            >
                {fixedWord}
            </span>
        </div>
    )
}

HeroRoleLoop.defaultProps = {
    roles: "Product,Interactive,Motion",
    label: "I AM A(N)",
    fixedWord: "Designer",
    interval: 1200,
    roleWidth: 390,
    fontSize: 72,
    color: "#2e2f31",
}

addPropertyControls(HeroRoleLoop, {
    roles: { type: ControlType.String, title: "Roles" },
    label: { type: ControlType.String, title: "Label" },
    fixedWord: { type: ControlType.String, title: "Fixed" },
    interval: { type: ControlType.Number, title: "Interval", min: 800, max: 5000, step: 100 },
    roleWidth: { type: ControlType.Number, title: "Role Width", min: 180, max: 700, step: 10 },
    fontSize: { type: ControlType.Number, title: "Font Size", min: 24, max: 140, step: 1 },
    color: { type: ControlType.Color, title: "Color" },
})
