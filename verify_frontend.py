
from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a context with mock storage state to simulate a logged-in user if needed,
        # or we can test the login flow. Given the complexity of Supabase auth,
        # checking the login page and potentially the chat layout (if public or mockable) is a good start.
        # Since we don't have valid credentials to login in this headless environment easily without seeding,
        # we will verify the Login page and the overall structure.

        # However, the user mentioned the history in the sidebar.
        # Ideally, we would mock the Supabase client, but that's hard in a black-box browser test.
        # We will try to navigate to the root. If redirected to /login, that confirms routing works.

        page = browser.new_page()

        try:
            # 1. Navigate to root (should redirect to login because we are not authenticated)
            print("Navigating to http://localhost:3000/ ...")
            page.goto("http://localhost:3000/", timeout=10000)
            page.wait_for_load_state("networkidle")

            # 2. Check if we are on the login page
            print(f"Current URL: {page.url}")
            if "/login" in page.url:
                print("Redirected to Login page successfully.")

                # Take a screenshot of the login page
                page.screenshot(path="login_verification.png")
                print("Screenshot saved to login_verification.png")

                # 3. Verify Login Page Elements
                # Check for Email input
                if page.locator('input[type="email"]').is_visible():
                    print("Email input visible.")

                # Check for Password input (since we switched to email/password)
                if page.locator('input[type="password"]').is_visible():
                    print("Password input visible.")

                # Check for Login button
                if page.get_by_role("button").first.is_visible():
                     print("Login button visible.")

            else:
                print("Did not redirect to login. taking screenshot of current state.")
                page.screenshot(path="unexpected_state.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
