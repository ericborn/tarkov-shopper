import { Autocomplete, Box, Card, CssBaseline, CssVarsProvider, Stack, Typography } from '@mui/joy';
import availableItems from './constants/data.json';

function App() {
    return (
        <CssVarsProvider defaultMode='dark'>
            <CssBaseline />
            <Box display='flex' justifyContent='center'>
                <Stack>
                    <Typography textAlign='center' level='h1'>
                        Tarkov Shopper
                    </Typography>
                    <Card variant='soft'>
                        <Stack>
                            <Autocomplete
                                getOptionLabel={(option) => option.name}
                                options={availableItems}
                            ></Autocomplete>
                        </Stack>
                    </Card>
                </Stack>
            </Box>
        </CssVarsProvider>
    );
}

export default App;
