import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import './FormCard.css';
import Link from "@mui/material/Link";
import Iconify from 'src/components/iconify';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
import { EDUCATION_LEVELS, Rubric, SUBJECTS } from 'src/types/evaluation';
import CircularProgress from "@mui/material/CircularProgress";
import Stack, { StackProps } from '@mui/material/Stack';
import { Grid, Typography } from '@mui/material';
import {formatDate, convertToTimeInterval, timeSince} from "src/utils/format-time";
import Chip from '@mui/material/Chip';
import './FormCard.css';
import { color } from 'framer-motion';

export interface Form {
    id?: string;
    title: string;
    labels: Label[]
    tags?: TagList
}
interface TagList {
    tags: string[]
    tagKey: string
    tagIcon?: string
}

interface Label {
    key: string;
    value?: any;
    iconPath?: string;
}

interface FormCardProps {
    form: Form;
    color?: 'green' | 'blue' | 'purple' | 'gray';
    onClick?: () => void;
    deleteFunc?: Function; // enables X button. Clicking X button calls this function
    menuOptions?: {
        title: string
        link?: string
        onClick?: () => void
    }[]
    goFunc?: Function | string; // enables -> button. Clicking -> button calls this function
    disabled?: boolean
    isLoading?: boolean
}

const FormCard: React.FC<FormCardProps> = (props) => {
    const theme = useTheme()
    const isMenuOpened = useBoolean(false)
    const [menuButton, setMenuButton] = useState<null | HTMLElement>(null);
    const tag_text_color = {"green": "#0F2015", "blue": "#00456B", "purple": "#3B346F", "gray": "#717273"}[props.color ? props.color : "blue"]

    const title = props.form.title;

    // Displayed labels will be the first three labels in the list if there are more than three
    // const displayLabels = props.form.labels.slice(0, Math.min(props.form.labels.length, 3));

    return (
        // Generate the color of the card based on the id
        <div className={"course-card " + props.color || 'blue'} onClick={props.disabled ? undefined : props.onClick} style={{
            cursor: (props.disabled || props.isLoading) ? "not-allowed" : "default",
            opacity: (props.disabled || props.isLoading) ? 0.5 : 1
        }}>
            <Stack margin={3} spacing={1}>
                <Typography variant="subtitle1" color={"white"} marginRight={2}>{title}</Typography>
                {props.form.labels.map((label, labelIndex) => ( // Display all labels
                    <Stack direction={"row"} justifyContent={"space-between"} key={labelIndex}>
                        <Stack direction={"row"} spacing={1}>
                            <Iconify icon={label.iconPath ? label.iconPath : "akar-icons:edit"} color={"#C6C6C6"} fontSize={"caption"}></Iconify>
                            <Typography variant="body2" color={"#C6C6C6"}>{label.key}</Typography>
                        </Stack>
                        <Typography variant="subtitle2" color={"white"}>{label.value}</Typography>
                    </Stack>
                ))}
                {
                    props.form.tags ? 
                    <>
                        {
                            <>
                                <Stack direction={"row"} spacing={0.8}>
                                    <Iconify icon={props.form.tags.tagIcon ?? "akar-icons:edit"} color={"#C6C6C6"} fontSize={"caption"}></Iconify>
                                    <Typography variant="body2" color={"#C6C6C6"}>{props.form.tags.tagKey}</Typography>
                                </Stack>
                                <Grid container spacing={1}>
                                    { props.form.tags.tags.length > 6 ?
                                        <>
                                        {props.form.tags.tags.slice(0, 6).map((tag, tagIndex) => (
                                            <Grid item key={tagIndex}>
                                                <Chip size="small" label={tag} variant='soft' sx={{color:tag_text_color,backgroundColor:"rgba(255,255,255,0.7)"}}/>
                                            </Grid>
                                        ))}
                                        <Grid item key={10}>
                                             <Chip size="small" label={`与其他${props.form.tags.tags.length-7}项`} variant='soft' sx={{color:tag_text_color,backgroundColor:"rgba(255,255,255,0.7)"}}/>
                                        </Grid>
                                        </>
                                        :
                                        props.form.tags.tags.map((tag, tagIndex) => (
                                            <Grid item key={tagIndex}>
                                                <Chip size="small" label={tag} variant='soft' sx={{color:tag_text_color,backgroundColor:"rgba(255,255,255,0.7)"}}/>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </>
                        }
                    </> :
                    <></>
                }
            </Stack>

            {props.isLoading && <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#eaeaead0", zIndex: 5}}>
                <div className='center-content'>
                    <CircularProgress color="primary" sx={{width: "100%", height: "100%"}} />
                </div>
            </div>}

            {props.deleteFunc && <ClearIcon className='clear-icon' sx={{color:"#fff"}} onClick={(e) => {
                e.stopPropagation()
                if (props.deleteFunc) props.deleteFunc()
            }} />}
            {props.menuOptions && 
                <>
                    <IconButton
                        className="form-card-icons more-vert" 
                        sx={{color:"#fff", position: "absolute", top: "15px", right: "10px", zIndex: 100}}
                        aria-label="more"
                        aria-controls="metric-menu"
                        aria-haspopup="true"
                        onClick={e => {
                            e.stopPropagation()
                            isMenuOpened.onTrue()
                            setMenuButton(e.currentTarget)
                        }}
                        >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>

                    <Menu
                        id="metric-menu"
                        anchorEl={menuButton}
                        onClose={isMenuOpened.onFalse}
                        open={isMenuOpened.value}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: 'auto',
                                    minWidth: '100px',
                                    maxHeight: 48 * 4.5,
                                },
                            }
                        }}
                    >
                        {props.menuOptions.map((option) => (
                            <MenuItem key={option.title} onClick={(e) => {
                                isMenuOpened.onFalse()
                                    option.onClick?.()
                                }}>
                                    <Link href={option.link ?? ""} component={RouterLink} underline="none" color="inherit" p={0}>
                                        {option.title}
                                    </Link>
                                </MenuItem>
                        ))}
                        </Menu>
                </>
            }
            {props.goFunc && (
                typeof props.goFunc === "string" ?
                <Link href={props.goFunc} component={RouterLink} underline="none" color="inherit">
                    <ArrowForwardIcon className="form-card-icons arrow-right" />
                </Link>
                : <ArrowForwardIcon className="form-card-icons arrow-right" onClick={(e) => {
                    e.stopPropagation();
                    (props.goFunc as Function)()
                }} />
            )}

        </div>
    );
};

export default FormCard;
