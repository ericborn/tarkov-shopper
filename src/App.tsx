import {
    Box,
    Card,
    CssBaseline,
    CssVarsProvider,
    List,
    ListItem,
    ListItemDecorator,
    Stack,
    Typography,
    styled,
} from '@mui/joy';
import { VirtualizedAutocomplete } from './components/VirtualizedAutocomplete';
import { useState } from 'react';
import { TarkovItem } from './types/items';

const TarkovTitle = styled(Typography)`
    margin-top: ${({ theme }) => theme.spacing(6)};
    margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

function App() {
    const [selectedItems, setSelectedItems] = useState<TarkovItem[]>([]);

    return (
        <CssVarsProvider defaultMode="dark">
            <CssBaseline />
            <Box display="flex" justifyContent="center">
                <Stack>
                    <TarkovTitle textAlign="center" level="h1">
                        Tarkov Shopper
                    </TarkovTitle>
                    <Card variant="soft">
                        <Stack>
                            <VirtualizedAutocomplete setSelectedItems={setSelectedItems} />
                            {selectedItems.length > 0 && (
                                <List sx={{ mt: 6 }}>
                                    {selectedItems.map((item) => (
                                        <ListItem key={item.id}>
                                            <ListItemDecorator sx={{ mr: 2 }}>
                                                <img src={item.image} alt={item.name} />
                                            </ListItemDecorator>
                                            <Typography>{item.name}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Stack>
                    </Card>
                </Stack>
            </Box>
        </CssVarsProvider>
    );
}

export default App;
