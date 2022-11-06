import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SetFile from "./SetFile";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SSH() {

    const { hostAddress, hostUserName, hostUserPassword } = useParams()
    const [filePath, setFilePath] = useState("ファイルを選択して下さい")
    const [target, setTarget] = useState()
    const [state, setState] = useState(false)
    const [complete, setComplete] = useState(true)
    const [outputs, setOutputs] = useState()
    const scrollRef = useRef(null)

    const handleExecCmd = () => {
        setComplete(false)
        setOutputs("")
        let line = ''
        for (let i = 0; i < target.commands.length; i++) {
            line += target.commands[i]
        }
        const res = window.electronAPI.execCmdBySSH(line, atob(hostUserPassword))
        setOutputs((prevOutputs) => `${prevOutputs}${res}`)
        setComplete(true)
    }

    const handleDisconnectSSH = () => {
        const disconnectSSH = async () => {
            await window.electronAPI.disConnectSSH()
            setState(false)
        }
        disconnectSSH()
    }

    useEffect( () => {
        const connectSSH = async () => {
            const res = await window.electronAPI.connectSSH(hostAddress, hostUserName, atob(hostUserPassword)) 
            res ? setOpenSuccess(true) : setOpenError(true)
            setState(res)
        }
        connectSSH()
    }, [])

    useEffect( () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [outputs])

    /* 通知用 */
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openWarning, setOpenWarning] = React.useState(false)
    const [openError, setOpenError] = React.useState(false);

    /* エラー閉じる用 */
    const handleCloseNotice = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false)
        setOpenWarning(false)
        setOpenError(false);
    };

    /* 画面遷移用 */
    const navigate = useNavigate()

    /* レンダリング */
    return (
        <Box sx={{ flexGrow: 1}}>
            <SetFile filePath={filePath} setFilePath={setFilePath} setTarget={setTarget} />
            <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ m:2 }}>
                <Grid item xs={12} textAlign="center" >
                    <TextField
                        id="outputs"
                        multiline
                        value={outputs}
                        minRows={13}
                        maxRows={13}
                        inputRef={scrollRef}
                        InputProps={{
                            readOnly: true,
                            style: { color: "white"},
                        }}
                        sx={{ minWidth: 500, backgroundColor: "black" }}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" display={complete ? "block" : "none" } spacing={2} sx={{ m:2 }}>
                <Grid item xs={12} textAlign="center" >
                    <Button variant="text" onClick={() => {navigate("/")}} disabled={state} sx={{ marginX: 1 }}>戻る</Button>
                    <Button variant="outlined" onClick={handleDisconnectSSH} disabled={!state} sx={{ marginX: 1 }}>切断</Button>
                    <Button variant="contained" onClick={handleExecCmd} disabled={!state} sx={{ marginX: 1 }}>実行</Button>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" display={complete ? "none" : "block" } spacing={2} sx={{ m:2 }}>
                <Grid item xs={12} textAlign="center" >
                    <CircularProgress />
                </Grid>
            </Grid>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseNotice}>
                    <Alert onClose={handleCloseNotice} severity="success" sx={{ width: '100%' }}>
                        接続に成功しました
                    </Alert>
                </Snackbar>
                <Snackbar open={openWarning} autoHideDuration={6000} onClose={handleCloseNotice}>
                    <Alert onClose={handleCloseNotice} severity="warning" sx={{ width: '100%' }}>
                        コマンドが失敗しました
                    </Alert>
                </Snackbar>
                <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseNotice}>
                    <Alert onClose={handleCloseNotice} severity="error" sx={{ width: '100%' }}>
                        接続に失敗しました
                    </Alert>
                </Snackbar>
            </Stack>
        </Box>
    )
}

export default SSH;