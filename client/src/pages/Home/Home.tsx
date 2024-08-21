import { Box, Button, Container, Divider, Typography, styled } from '@mui/material';
import { Add, List } from '@mui/icons-material';

const CenteredContainer = styled(Container)`
  display: flex;
  justify-content: center;
`;

const CenteredBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: left;
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

const BodyText = styled(Typography)`
  font-size: 0.875rem;
  padding-bottom: 1em;
`;

const ButtonContainer = styled(Box)`
  margin-top: 8px;
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
    flex: 1;
    gap: 8px;
`

const Home = () => {
  return (
    <CenteredContainer>
      <CenteredBox>
        <Title variant="h4" variantMapping={{ h4: 'h4' }}>
          Test online trust box
        </Title>
        <BodyText variant="body1" fontWeight={500}>
          This trust box is not real. However, you can use it to send a test report and see how it works.
        </BodyText>
        <BodyText variant="body1">
          Anyone who is a witness or victim of bullying, inappropriate behavior or has a problem they are ashamed to talk about personally can reach out through the FaceUp online trust box. The reports are anonymous, so students do not have to worry about the report being used against them.
        </BodyText>
        <BodyText variant="body1">
          If you want to report a <strong>real case of bullying</strong>, look for your school and send the report to that school. In case of a life-threatening situation, call 911.
        </BodyText>
        <Divider />
        <ButtonContainer>
          <StyledButton variant="contained" color="primary" href="/report">
            <Add />
            Create test report
          </StyledButton>
          <StyledButton variant="outlined" color="primary" href="/reports">
            <List />
            List of reports
          </StyledButton>
        </ButtonContainer>
      </CenteredBox>
    </CenteredContainer>
  );
};

export default Home;