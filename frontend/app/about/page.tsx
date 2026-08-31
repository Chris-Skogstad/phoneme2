import PageHeading from "../components/PageHeading";
import InfoSection from "../components/InfoSection";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="About This Project"
        description="A phoneme-based activity builder for Speech Pathology classrooms."
      />

      <InfoSection title="What is this project?">
        <p>
          This application is a frontend builder that allows Speech
          Pathology teachers to create classroom activities based on
          phonemes rather than standard spelling. Teachers can configure an
          activity, preview it instantly, and generate a single downloadable
          HTML file that students can play in any web browser, with no
          installation or account required.
        </p>
      </InfoSection>

      <InfoSection title="Assessment 1 scope">
        <p>
          This version of the project is frontend only. There is currently
          no database or dynamic word list management, so each activity
          uses a small, fixed set of phoneme based words. A later assessment
          will introduce a database so teachers can manage and expand their
          own word lists.
        </p>
      </InfoSection>

      <InfoSection title="The Wordle tool">
        <p>
          The Wordle activity challenges students to guess a phoneme based
          word within a limited number of attempts. Each guess is compared
          phoneme by phoneme, showing which symbols are correct, in the
          wrong position, or not in the word at all. Hovering over any
          phoneme reveals its English letter equivalent, and difficulty
          settings adjust the length of the word and the number of guesses
          allowed.
        </p>
      </InfoSection>

      <InfoSection title="The Word Search tool">
        <p>
          The Word Search activity generates a grid filled with phoneme
          symbols, hiding a small set of phoneme based words for students to
          find. Hovering over the word list reveals the English translation
          for each word, and difficulty settings adjust the size of the
          puzzle grid.
        </p>
      </InfoSection>

     
      <InfoSection title="How to use this website">
  <div className="aspect-video w-full rounded-lg overflow-hidden">
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/Q6H0KXYtN7E"
      title="How to use this website"
      allowFullScreen
    />
  </div>
</InfoSection>
    </main>
  );
}