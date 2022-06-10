import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, Grid, IconButton, TextField, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { bluetoothService } from '../../services/bluetooth.service';
import { BluetoothDevice } from '../../infrastructure/generated/api';
import { ComponentType, useEffect, useState } from 'react';
import { handleServerRestError } from '../../services/notifications.service';
import { Loader } from '../../components/Loader';
import { compareIpByDevicePart } from '../../infrastructure/utils';
import { useTranslation } from 'react-i18next';
import { ThemeTooltip } from '../../components/global/ThemeTooltip';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import { DEFAULT_FONT_RATION } from '../../infrastructure/consts';
import { ApiFacade } from '../../infrastructure/generated/proxies/api-proxies';
import { DashboardPageInjectProps } from '../Dashboard';
import { NoContent } from '../../components/NoContent';
import RouterIcon from '@material-ui/icons/Router';
import { marginLeft } from '../../logic/common/themeUtils';
import { useData } from '../../hooks/useData';
import { PageLayout } from '../../components/layouts/PageLayout';

/**
 * The sort formula for sorting devices by rssi -> name
 */
function sortDevicesFormula(a: BluetoothDevice, b: BluetoothDevice): number {
    if (a.uuid && b.uuid) {
        return compareIpByDevicePart(a.uuid, b.uuid);
    }

    if (a.uuid) {
        return -1;
    }

    if (b.uuid) {
        return 1;
    }

    return (a.name || '') < (b.name || '') ? -1 : 1;
}

const NAME_CONTROLS_WIDTH = 45;
const NAME_MOBILE_WIDTH = DEFAULT_FONT_RATION * 8;
const NAME_DESKTOP_WIDTH = DEFAULT_FONT_RATION * 15;

interface BluetoothComponentProps {
    device: BluetoothDevice;
}

interface BluetoothComponent {
    title: string;
    content: ComponentType<BluetoothComponentProps>;
}

interface BluetoothLayoutProps {
    devices: BluetoothDevice[];
    name: BluetoothComponent;
    uuid: BluetoothComponent;
    rssi: BluetoothComponent;
    connectionState: BluetoothComponent;
    addressType: BluetoothComponent;
}

/**
 * The network devices page desktop layout
 */
function BluetoothDesktopLayout(props: BluetoothLayoutProps) {
    return <TableContainer component={Paper}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell >{props.name.title}</TableCell>
                    <TableCell align="center">{props.uuid.title}</TableCell>
                    <TableCell align="center">{props.rssi.title}</TableCell>
                    <TableCell align="center">{props.connectionState.title}</TableCell>
                    <TableCell align="center">{props.addressType.title}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody >
                {props.devices.map((device) => (
                    <TableRow
                        key={device.uuid}
                    >
                        <TableCell ><props.name.content device={device} /></TableCell>
                        <TableCell align="center"><props.uuid.content device={device} /></TableCell>
                        <TableCell align="center"><props.rssi.content device={device} /></TableCell>
                        <TableCell align="center"><props.connectionState.content device={device} /></TableCell>
                        <TableCell align="center"><props.addressType.content device={device} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}

/**
 * The network devices page mobile layout
 */
function BluetoothMobileLayout(props: BluetoothLayoutProps) {
    const theme = useTheme();

    const titleFontSize = DEFAULT_FONT_RATION * 0.5;
    const textFontSize = DEFAULT_FONT_RATION * 0.7;

    return <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
    >
        {props.devices.map(device =>
            <Paper elevation={3} style={{ margin: DEFAULT_FONT_RATION }}>
                <Grid
                    style={{ padding: DEFAULT_FONT_RATION }}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                >
                    {/* On the first row, show the editable device name */}
                    <Grid
                        style={{ width: '100%', marginBottom: DEFAULT_FONT_RATION * 0.5 }}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Typography style={{ fontSize: titleFontSize, width: '100%', color: theme.palette.text.hint }} >{props.name.title}</Typography>
                        <div style={{ fontSize: textFontSize, width: '100%' }} ><props.name.content device={device} /></div>
                    </Grid>
                    {/* On the second row, show the uuid & IP */}
                    <Grid
                        style={{ width: '100%', marginBottom: DEFAULT_FONT_RATION * 0.5 }}
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-end"
                    >
                        <div>
                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                            >
                                <div>
                                    <Typography style={{ fontSize: titleFontSize, color: theme.palette.text.hint }} >{props.uuid.title}</Typography>
                                </div>
                                <div>
                                    <Typography style={{ fontSize: textFontSize }} ><props.uuid.content device={device} /></Typography>
                                </div>
                            </Grid>
                        </div>
                        <div>
                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                            >
                                <div>
                                    <Typography style={{ fontSize: titleFontSize, color: theme.palette.text.hint }} >{props.uuid.title}</Typography>
                                </div>
                                <div>
                                    <Typography style={{ fontSize: textFontSize }} ><props.uuid.content device={device} /></Typography>
                                </div>
                            </Grid>
                        </div>
                    </Grid>
                    {/* On the last row, show the connectionState name */}
                    <Grid
                        style={{ width: '100%' }}
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Typography style={{ fontSize: titleFontSize, width: '100%', color: theme.palette.text.hint }} >{props.connectionState.title}</Typography>
                        <Typography style={{ fontSize: textFontSize }} ><props.connectionState.content device={device} /></Typography>
                    </Grid>
                </Grid>
            </Paper>
        )
        }
    </Grid >
}

export default function Bluetooth(props: DashboardPageInjectProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const wideDesktopMode = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const [devices, loading] = useData(bluetoothService, []);

    const [saving, setSaving] = useState<boolean>(false);
    const [filteredDevices, setFilteredDevices] = useState<BluetoothDevice[]>([]);
    const [editNameMode, setEditNameMode] = useState<string>('');

    useEffect(() => {
        // every time the devices collection has changed or the search term changed, re-calc the filtered minions
        calcDevicesFilter(devices);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devices, props.searchText]);

    function calcDevicesFilter(devices: BluetoothDevice[]) {
        const searchString = props.searchText?.trim().toLowerCase() || '';
        // In case of empty search term, "clone" collection anyway to avoid sort cache issue
        const filteredDevices = !searchString ? [...devices] : devices.filter(d => {
            // If the name match, return true
            if (d.name?.toLowerCase().includes(searchString)) {
                return true;
            }
            if (d.uuid?.toLowerCase().includes(searchString)) {
                return true;
            }
            if (d.uuid?.toLowerCase().includes(searchString)) {
                return true;
            }
            if (d.connectionState?.toLowerCase().includes(searchString)) {
                return true;
            }
            return false;
        });

        setFilteredDevices(filteredDevices.sort(sortDevicesFormula));
    }

    function selectNameToEdit(device: BluetoothDevice) {
        setEditNameMode(device.uuid);
    }

    async function setName(device: BluetoothDevice, name: string) {
        setSaving(true);
        const lastName = device.name;
        try {
            // Create "new" device instance with the new name
            const setDevice = { ...device, name };
            // Update current view device name
            device.name = setDevice.name;
            await ApiFacade.DevicesApi.setBluetoothDeviceConfig(setDevice, device.uuid);
            bluetoothService.postNewData(devices);
        } catch (error) {
            // Once change failure, revert the name change
            device.name = lastName;
            handleServerRestError(error);
        }
        setSaving(false);
        // Reset edit name input
        setEditNameMode('');
    }

    if (loading) {
        return <Loader fancy={{ text: t('dashboard.loading.data', { data: t('global.network').toLowerCase() }) }} />;
    }

    // If there are no any device, show proper message
    if (devices.length === 0) {
        return <NoContent Icon={RouterIcon} message={t('dashboard.network.no.devices.message')} />
    }

    // If there are no any device match the search, show proper message
    if (filteredDevices.length === 0) {
        return <NoContent Icon={RouterIcon} message={t('dashboard.network.no.devices.match.message')} />
    }


    function NameComponent(props: BluetoothComponentProps) {
        const [editName, setEditName] = useState<string>();

        const nameCellWidth = wideDesktopMode ? NAME_DESKTOP_WIDTH : NAME_MOBILE_WIDTH;

        return <Grid
            id="network-page-container"
            style={{ minWidth: nameCellWidth, width: '100%' }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
        >
            {editNameMode !== props.device.uuid && <div style={{
                // Show all over the width, but give some space for the edit button
                width: `calc(100% - ${NAME_CONTROLS_WIDTH}px)`,
            }}>
                <Typography style={{
                    width: wideDesktopMode ? nameCellWidth - NAME_CONTROLS_WIDTH : '100%',
                    textOverflow: 'clrssi',
                    overflowWrap: 'break-word'
                }}>
                    {props.device.name}
                </Typography>
            </div>}
            {/* On edit mode, show the name within the text input */}
            {editNameMode === props.device.uuid && <TextField
                // Show all over the width, but give some space for the save/cancel/loading
                style={{ width: `calc(100% - ${NAME_CONTROLS_WIDTH}px)` }}
                disabled={saving}
                variant="standard"
                value={editName === undefined ? props.device.name : editName}
                onChange={(e) => {
                    setEditName(e.target.value);
                }}
            />}
            {/* The edit button, show when not in edit mode */}
            {editNameMode !== props.device.uuid && <div>
                <ThemeTooltip title={<span>{t('global.edit')}</span>} >
                    <IconButton
                        disabled={saving}
                        onClick={() => selectNameToEdit(props.device)}
                        color="inherit">
                        <EditIcon fontSize="small" />
                    </IconButton>
                </ThemeTooltip>
            </div>}
            {/* On edit mode, the edit controls container (edit, save, loading etc) */}
            {editNameMode === props.device.uuid && <div
                style={{ [marginLeft(theme)]: DEFAULT_FONT_RATION * 0.4 }}
            >
                {saving && <CircularProgress size={DEFAULT_FONT_RATION * 1.85} thickness={8} />}
                {!saving && <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <div>
                        <ThemeTooltip title={<span>{t('global.save')}</span>} >
                            <IconButton
                                style={{ padding: DEFAULT_FONT_RATION * 0.15 }}
                                onClick={() => { setName(props.device, editName || ''); }}
                                color="inherit">
                                <SaveIcon style={{ fontSize: DEFAULT_FONT_RATION * 0.8 }} />
                            </IconButton>
                        </ThemeTooltip>
                    </div>
                    <div>
                        <ThemeTooltip title={<span>{t('global.cancel')}</span>} >
                            <IconButton
                                style={{ padding: DEFAULT_FONT_RATION * 0.15 }}
                                onClick={() => { setEditNameMode(''); }}
                                color="inherit">
                                <CloseIcon style={{ fontSize: DEFAULT_FONT_RATION * 0.8 }} />
                            </IconButton>
                        </ThemeTooltip>
                    </div>
                </Grid>}
            </div>}
        </Grid>;
    }

    function uuidComponent(props: BluetoothComponentProps) {
        return <div>{props.device.uuid}</div>;
    }

    function RssiComponent(props: BluetoothComponentProps) {
        return <div>{props.device.rssi}</div>;
    }

    function ConnectionComponent(props: BluetoothComponentProps) {
        return <div>{props.device.connectionState}</div>;
    }

    function AddressTypeComponent(props: BluetoothComponentProps) {
        return <div>{props.device.addressType}</div>;
    }

    const BluetoothLayout = wideDesktopMode ? BluetoothDesktopLayout : BluetoothMobileLayout;

    return <PageLayout>
        <BluetoothLayout
            devices={filteredDevices}
            name={{
                title: t('dashboard.bluetooth.device.name'),
                content: NameComponent
            }}
            uuid={{
                title: t('dashboard.bluetooth.device.uuid'),
                content: uuidComponent
            }}
            rssi={{
                title: t('dashboard.bluetooth.device.rssi'),
                content: RssiComponent
            }}
            connectionState={{
                title: t('dashboard.bluetooth.device.connectionState'),
                content: ConnectionComponent
            }}
            addressType={{
                title: t('dashboard.bluetooth.device.connectionState'),
                content: AddressTypeComponent
            }}
        />
    </PageLayout>;
}