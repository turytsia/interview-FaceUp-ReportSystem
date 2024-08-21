import { Breadcrumbs, Button, Container, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Edit } from '@mui/icons-material';
import axios from '../../utils/axios';
import { ReportType } from '../Report/Report';
import { Category } from '../../utils/constants';

const StickyContainer = styled(Container)`
  padding: 16px;
  position: sticky;
  top: 0;
`;

const PaddedContainer = styled(Container)`
  padding: 16px;
`;

const Cell = styled(TableCell)`
    max-width: 30ch; 
    text-overflow: ellipsis; 
    white-space: nowrap;
    overflow: hidden;
`

const ReportList = () => {
  const [reports, setReports] = useState<ReportType[]>([]);

  const fetchReports = useCallback(
    async () => {
        try {
          const { data } = await axios.get('/reports');
          setReports(data);
        } catch (error) {
          console.error(error);
        }
      },
      []
  )

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <>
      <StickyContainer>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>
      </StickyContainer>
      <PaddedContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Who Needs Help</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Details</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <Cell>{report.id}</Cell>
                <Cell>{Category[report.category as keyof typeof Category]}</Cell>
                <Cell>{report.whoNeedsHelp}</Cell>
                <Cell>{report.class}</Cell>
                <Cell>{report.details}</Cell>
                <TableCell>
                  <Button color="primary" variant="outlined" sx={{ gap: '8px' }} href={`/reports/${report.id}`}>
                    <Edit /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PaddedContainer>
    </>
  );
};

export default ReportList;