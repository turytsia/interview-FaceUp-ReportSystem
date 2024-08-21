import { ChangeEventHandler, FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, styled } from '@mui/material'
import { Category, CategoryInverse } from '../../utils/constants';
import useIsNewReport from './hooks/useIsNewReport';
import axios from '../../utils/axios';
import { Download, FileUploadOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs, { BreadcrumbItem } from '../../components/Breadcrumbs/Breadcrumbs';
import FileInput from '../../components/FileInput/FileInput';
import { LoadingButton } from '@mui/lab';

const StickyContainer = styled(Container)`
  padding: 16px;
  position: sticky;
  top: 0;
`;

const CenteredContainer = styled(Container)`
  display: flex;
  justify-content: center;
`;

const CenteredBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 560px;
`;

const Title = styled(Typography)`
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  font-size: 30px;
  padding-bottom: 0.75rem;
`;

const FormBox = styled(Box)`
  display: flex;
  gap: 8px;
`;

export type ReportType = {
    id: number
} & ReportInput

type ReportInput = {
    category: string,
    whoNeedsHelp: string,
    class: string,
    details: string,
    filePath: File | null | undefined,
}

const breadcrumbsNewReport: BreadcrumbItem[] = [
    {
        name: 'New Report',
    }
]

const Report = () => {

    const { isNewReport, reportId } = useIsNewReport()
    const navigate = useNavigate()

    const [report, setReport] = useState<ReportInput>({
        category: '',
        whoNeedsHelp: '',
        class: '',
        details: '',
        filePath: null,
    });

    const [isLoading, setIsLoading] = useState(false)

    const fetchReport = useCallback(
        async () => {
            if (!reportId) return

            try {
                const { data } = await axios.get<ReportType>(`/reports/${reportId}`)
                setReport({
                    ...data,
                    category: Category[data.category as keyof typeof Category]
                })
            } catch (error) {
                console.error(error)
            }
        },
        [reportId]
    )

    const updateReport = useCallback(
        async () => {
            if (!reportId) return;
    
            const formData = new FormData();
    
            formData.append('category', CategoryInverse[report.category as keyof typeof CategoryInverse] as string);
            formData.append('whoNeedsHelp', report.whoNeedsHelp);
            formData.append('class', report.class);
            formData.append('details', report.details);
    
            if (report.filePath) {
                formData.append('filePath', report.filePath, report.filePath.name);
            }
    
            try {
                setIsLoading(true);
                await axios.put<ReportType>(`/reports/${reportId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                navigate('/reports');
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        [navigate, report, reportId]
    );

    const deleteReport = useCallback(
        async () => {
            if (!reportId) return

            try {
                setIsLoading(true)
                await axios.delete<ReportType>(`/reports/${reportId}`)
                navigate('/reports')
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        },
        [navigate, reportId]
    )

    const createReport = useCallback(
        async () => {

            const formData = new FormData();

            formData.append('category', CategoryInverse[report.category as keyof typeof CategoryInverse] as string);
            formData.append('whoNeedsHelp', report.whoNeedsHelp);
            formData.append('class', report.class);
            formData.append('details', report.details);

            if (report.filePath) {
                formData.append('filePath', report.filePath, report.filePath.name);
            }

            try {
                setIsLoading(true)
                await axios.post<ReportType>('/reports', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setIsLoading(false)
                navigate('/reports')
            } catch (error) {
                setIsLoading(false)
                console.error(error);
            }
        },
        [navigate, report.category, report.class, report.details, report.filePath, report.whoNeedsHelp]
    )

    useEffect(
        () => {
            fetchReport()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
        (event) => {
            const { name, value } = event.target;
            setReport(prev => ({ ...prev, [name]: value }));
        },
        []
    )


    const handleCategoryChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            const { name, value } = event.target;
            setReport(prev => ({ ...prev, [name]: value }));
        },
        []
    )

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            setReport(prev => ({ ...prev, filePath: event.target?.files?.[0] }))
        },
        []
    )

    const handleDownload = async () => {
        if (!report.filePath) return

        const filePath = report.filePath as unknown as string
        const fileName = filePath.split('/').pop(); // Extract the file name from the path

        try {
            const response = await axios.get(filePath, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            const link = document.createElement('a');

            link.href = window.URL.createObjectURL(blob);
            link.download = fileName as string;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isNewReport) {
            createReport()
        } else {
            updateReport()
        }
    };

    const breadcrumbsExistingReport: BreadcrumbItem[] = useMemo(
        () => (
            [
                {
                    name: 'Reports',
                    link: '/reports'
                },
                {
                    name: reportId as string
                }
            ]
        ),
        [reportId]
    )

    const breadcrumbItems = useMemo(
        () => isNewReport ? breadcrumbsNewReport : breadcrumbsExistingReport,
        [breadcrumbsExistingReport, isNewReport]
    )

    return (
        <>
            <StickyContainer>
                <Breadcrumbs items={breadcrumbItems} />
            </StickyContainer>
            <CenteredContainer
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <CenteredBox>
                    <Title variant="h4" variantMapping={{ h4: 'h4' }}>
                        {isNewReport ? 'New' : 'Update'} Report
                    </Title>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="category"
                                value={report.category}
                                onChange={handleCategoryChange}
                                label="Category"
                            >
                                {Object.values(Category).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            id="whoNeedsHelp"
                            name="whoNeedsHelp"
                            label="Who needs help"
                            value={report.whoNeedsHelp}
                            onChange={handleInputChange}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            id="class"
                            name="class"
                            label="Class"
                            value={report.class}
                            onChange={handleInputChange}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            id="details"
                            name="details"
                            label="Details"
                            multiline
                            rows={4}
                            value={report.details}
                            onChange={handleInputChange}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            variant="standard"
                            type="text"
                            value={report.filePath instanceof File ? report.filePath.name : report.filePath}
                            InputProps={{
                                endAdornment: (
                                    <>
                                    <IconButton component="label">
                                        <FileUploadOutlined />
                                        <FileInput onChange={handleFileChange} />
                                    </IconButton>
                                    <IconButton onClick={handleDownload}>
                                        <Download />
                                    </IconButton>
                                    </>
                                ),
                            }}
                        />

                        <FormBox sx={{ mt: 2 }}>
                            <LoadingButton loading={isLoading} type="submit" variant="contained" color="primary">
                                {isNewReport ? 'Create' : 'Update'}
                            </LoadingButton>

                            {!isNewReport && (
                                <Button variant="contained" color="error" onClick={deleteReport}>
                                    Delete
                                </Button>
                            )}
                        </FormBox>
                    </form>
                </CenteredBox>
            </CenteredContainer>
        </>
    )
}

export default Report