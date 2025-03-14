import { render, screen } from "@testing-library/react";
import TopNav from "@/app/components/TopNav/TopNav";

describe("TopNav", () => {

  test("Top navigation is rendered", () => {
    const { getByRole } = render(<TopNav isLoggedIn={false} />);
    const navBar = getByRole("navigation");

    expect(navBar).toBeTruthy();
  });

  test("Top navigation is rendered with Login button", () => {
    render(<TopNav isLoggedIn={false} />);
    expect(screen.findAllByAltText('Login')).toBeTruthy();
  });

  test("Top navigation is rendered with Profile button", () => {
    render(<TopNav isLoggedIn={true} />);
    expect(screen.findAllByAltText('Profile')).toBeTruthy();
  });

});
