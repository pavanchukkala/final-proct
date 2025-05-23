// src/components/dashboard/recruiter/create-test-wizard/candidate-preview.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CandidatePreview() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Candidate Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Test Title</h3>
            <p className="text-base font-medium">Frontend Developer Screening</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Duration</h3>
            <p className="text-base font-medium">60 minutes</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Total Questions</h3>
            <p className="text-base font-medium">15 questions</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Sections</h3>
            <ul className="list-disc list-inside text-base font-medium">
              <li>MCQs - 10 Questions</li>
              <li>Code Output - 3 Questions</li>
              <li>Paragraph Writing - 2 Questions</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Candidates will have to complete the test in one go. No pause or revisit.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline">Edit</Button>
            <Button variant="default">Publish Test</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
