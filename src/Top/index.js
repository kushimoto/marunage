import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdorment from '@mui/material/InputAdornment';
import Computer from '@mui/icons-material/Computer';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Password from '@mui/icons-material/Password';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Top() {

    /* ホスト情報 */
    const [hostAddress, setHostAddress] = useState()
    const [hostUserName, setHostUserName] = useState()
    const [hostUserPassword, setHostUserPassword] = useState()

    /* ホスト情報保持用 */
    const handleHostAddressChange = (event) => {
        setHostAddress(event.target.value)
    }

    const handleHostUserNameChange = (event) => {
        setHostUserName(event.target.value)
    }

    const handleHostPasswordChange = (event) => {
        setHostUserPassword(event.target.value)
    }

    /* 画面遷移用 */
    const navigate = useNavigate()

    /* エラー表示用 */
    const [openError, setOpenError] = React.useState(false);

    /* 接続用 */
    const handleConnect = () => {
        if (hostAddress && hostUserName && hostUserPassword) {
            navigate(`/ssh/${hostAddress}/${hostUserName}/${btoa(hostUserPassword)}`)
        } else {
            setOpenError(true);
        }
    }

    /* エラー閉じる用 */
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    /* レンダリング */
    return (
        <Box sx={{ flexGrow: 1}}>
            <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ m:2 }}>
                <Grid item xs={12} textAlign="center">
                    <Typography variant="h5" gutterBottom>
                        ホストの情報を入力
                    </Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ m:2 }}>
                <Grid item xs={12} textAlign="center" >
                    <FormControl style={{ minWidth: 300}}>
                        <InputLabel htmlFor="host-address">ホストIPアドレス(IPv4)</InputLabel>
                        <Input
                            id="host-address"
                            value={hostAddress}
                            onChange={handleHostAddressChange}
                            startAdornment={
                                <InputAdorment position="start">
                                    <Computer />
                                </InputAdorment>
                            }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} textAlign="center" >
                    <FormControl style={{ minWidth: 300}}>
                        <InputLabel htmlFor="host-user-name">ユーザー名</InputLabel>
                        <Input
                            id="host-user-name"
                            value={hostUserName}
                            onChange={handleHostUserNameChange}
                            startAdornment={
                                <InputAdorment position="start">
                                    <AccountCircle />
                                </InputAdorment>
                            }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} textAlign="center" >
                    <FormControl style={{ minWidth: 300}}>
                        <InputLabel htmlFor="host-user-password">パスワード</InputLabel>
                        <Input
                            id="host-user-password"
                            label="Password"
                            type="Password"
                            value={hostUserPassword}
                            onChange={handleHostPasswordChange}
                            startAdornment={
                                <InputAdorment position="start">
                                    <Password />
                                </InputAdorment>
                            }
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} textAlign="center" >
                    <Button variant="outlined" onClick={window.electronAPI.closeWindow} sx={{ marginX: 1 }}>終了</Button>
                    <Button variant="contained" onClick={handleConnect} sx={{ marginX: 1 }}>開始</Button>
                </Grid>
            </Grid>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                    <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                        接続情報を入力して下さい
                    </Alert>
                </Snackbar>
            </Stack>
        </Box>
    )

}

export default Top;