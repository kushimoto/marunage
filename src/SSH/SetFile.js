import { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

const SetFile = ({ filePath, setFilePath, setTarget}) => {

    const handleGetFilePath = () => {
        const getFilePath = async () => {
            setFilePath(await window.electronAPI.getFilePath())
        }
        getFilePath()
    }
    
    useEffect(() => {
        const openYaml = async () => {
            setTarget(await window.electronAPI.fileOpenAsYAML(filePath))
        }
        openYaml()
    }, [filePath])

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ m:2 }}>
            <Grid item xs={12} textAlign="center">
                {`ファイル名：${filePath.split('/').pop().split('\\').pop()}`}
                <Button variant="outlined" onClick={handleGetFilePath} sx={{ marginX: 1 }}>選択</Button>
            </Grid>
        </Grid>
    )

}

export default SetFile;