import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployer } from '@/contexts/EmployerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  FileText, 
  LogOut, 
  Calendar,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EmployerDashboard = () => {
  const { employer, logout, getCandidates } = useEmployer();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!employer) {
      navigate('/employer-login');
      return;
    }

    const loadCandidates = async () => {
      const candidateData = await getCandidates();
      setCandidates(candidateData);
      setLoading(false);
    };

    loadCandidates();
  }, [employer, navigate, getCandidates]);

  const handleLogout = () => {
    logout();
    navigate('/employer-login');
  };

  const completedCandidates = candidates.filter(c => c.assessment_completed);
  const pendingCandidates = candidates.filter(c => !c.assessment_completed);

  if (!employer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {employer.name}</h1>
              <p className="text-muted-foreground">Manage your candidate assessments</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Assessments</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCandidates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCandidates.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => navigate('/invite-candidate')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Candidate
          </Button>
          <Button variant="outline" onClick={() => navigate('/sample-reports')}>
            <FileText className="w-4 h-4 mr-2" />
            Sample Reports
          </Button>
        </div>

        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Candidates</CardTitle>
            <CardDescription>
              Manage and view assessment results for your candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading candidates...</div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No candidates yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by inviting candidates to take assessments
                </p>
                <Button onClick={() => navigate('/invite-candidate')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Your First Candidate
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{candidate.full_name || candidate.email}</div>
                      <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      {candidate.position_applied && (
                        <div className="text-sm text-muted-foreground">
                          Position: {candidate.position_applied}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={candidate.assessment_completed ? "default" : "secondary"}>
                        {candidate.assessment_completed ? "Completed" : "Pending"}
                      </Badge>
                      {candidate.assessment_completed && (
                        <Button size="sm" onClick={() => navigate(`/candidate-report/${candidate.id}`)}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;