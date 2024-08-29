import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Iconify from "../iconify"
import { grey } from "src/theme/palette"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"

interface Props {
    title: string
    collapsedTitle?: string
    expandTitle?: string
    onAddButtonPressed?: () => void
    isOpened: boolean
    setIsOpened: (opened: boolean) => void
    children: JSX.Element
}

export default function CollapsibleSection({ title, isOpened, setIsOpened, children, expandTitle, collapsedTitle, ...props }: Props) {
    return <Box sx={{
        marginTop: "30px",
    }}>
        <Button variant="soft" sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            height: "60px",
            textAlign: "left",
            backgroundColor: grey[200],
            "&:hover": {
                backgroundColor: grey[250]
            },
            borderRadius: 1.5,
            px: 2,
            alignItems: "center"
        }} disableFocusRipple onClick={(e) => setIsOpened(!isOpened)}>
            <Typography variant="h5" flexGrow={1} fontWeight={800}>{title}</Typography>
            <Typography variant="caption" fontSize={14} px={1} color={grey[500]}>{isOpened ? expandTitle ?? "" : collapsedTitle ?? "已折叠"}</Typography>
            {props.onAddButtonPressed && isOpened && <IconButton onClick={e => {
                e.stopPropagation()
                props.onAddButtonPressed!()
            }} onMouseDown={e => e.stopPropagation()} sx={{mx: 1.5}}>
                <AddIcon scale={1.1} />
            </IconButton>}
            <Iconify
                width={24}
                className="arrow"
                sx={{rotate: isOpened ? "0deg" : "-180deg", transitionDuration: "0.2s", mr: 1}}
                icon={'eva:arrow-ios-downward-fill'}
            />
        </Button>
        <Collapse in={isOpened}>
            <Box px={0} py={2} pb={1} sx={{minHeight: "min-content"}}>
                {children}
            </Box>
        </Collapse>
    </Box>
}