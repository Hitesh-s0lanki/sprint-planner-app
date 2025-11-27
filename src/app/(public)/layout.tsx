type Props = { children: React.ReactNode };
import Navbar from "./_components/navbar";

const PublicLayout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default PublicLayout;
