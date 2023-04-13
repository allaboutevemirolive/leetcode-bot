import os
from lxml import html
from playwright.sync_api import sync_playwright

import re




inputFile = 'small-sample.txt'

with open(inputFile, 'r', encoding="utf-8") as f:
    matches = re.findall(r'^(\d+)\. (.*)', f.read(), re.MULTILINE)

for match in matches:
    file_number = match[0].zfill(4)

    # Define the symbols to be removed
    symbols = "~!@#$%^&*()_+{}|:<>?-=[]\\;',/"

    # Clean the file name
    file_name = match[1].lower()
    for symbol in symbols:
        file_name = file_name.replace(symbol, ' ')
    file_name = '-'.join(file_name.split())


    folder_number_name = f"{file_number}.{file_name}"
    file_name_number   = f"{file_name}{file_number}"

    target_URL = f"https://leetcode.com/problems/{file_name}/solutions/"

    print(target_URL)


    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto(target_URL)
        except Exception as e:
            print(f"An error occurred: {e}\n")
            print("There is no valid URL\n")
            continue

        try:
            search_box = page.locator("//input[@placeholder='Search']")
            search_query = "chappy1"
            search_box.fill(search_query)
            page.wait_for_selector("//input[@placeholder='Search']", timeout=3000)
            print("Search box filled")
        except TimeoutError as e:
            print("Timed out or element not found. Skipping search.")
            continue


        try:
            print(f"//a[contains(@href,'/problems/{file_name}/solutions/')]")
            # Wait for the link element to appear
            link_element = page.locator(f"//a[contains(@href,'/problems/{file_name}/solutions/')]")
            href = link_element.get_attribute("href")
            complete_link = "https://leetcode.com" + href
            print(complete_link)
        except TimeoutError as e:
            print("Timed out or element not found. Skipping link.")
            continue

                


        print("Link found")

        try:
            page.goto(complete_link)
            print("Page loaded")
        except Exception as e:
            print(f"An error occurred: {e}\n")
            print("There is no valid URL\n")
            continue


        


        # C++
        # In case C++ is not available / not the first option
        # What if there is no C++ button?
        try:
            # Visible button
            page.click('div.text-label-1:has-text("C++")')
        except Exception as e:
            try:
                # Hidden button
                page.click('div.text-label-4:has-text("C++")')
            except Exception as e:
                print(f"An error occurred: {e}\n")
                print("There is no C++ button\n")
                continue
            
        cpp_code = page.inner_html('.language-cpp')
        tree = html.fromstring(cpp_code)
        target_cpp = tree.text_content()
        
        # Create "folder_number_name" once
        os.makedirs(folder_number_name)
        text_cpp = f"{folder_number_name}/{file_name_number}.cpp"
        with open(text_cpp, "w") as f:
            f.write(target_cpp)




        # Python3
        # Since we have solve the button click problem, 
        # we can assume that the rest of button is hidden, we set it as 4
        # But, what if there is no Python3 button?
        try:
            # Hidden button
            page.click('div.text-label-4:has-text("Python3")')
        except Exception as e:
            try:
                # Visible button
                page.click('div.text-label-1:has-text("Python3")')
            except Exception as e:
                print(f"An error occurred: {e}\n")
                print("There is no Python3 button\n")
                continue

        python_code = page.inner_html('.language-python')
        tree = html.fromstring(python_code)
        target_python = tree.text_content()
        
        # Already create "folder_number_name"
        text_python = f"{folder_number_name}/{file_name_number}.py"
        with open(text_python, "w") as f:
            f.write(target_python)
        
        


        # Java
        # What if there is no Java button?
        try:
            # Hidden button
            page.click('div.text-label-4:has-text("Java")')
        except Exception as e:
            try:
                # Visible button
                page.click('div.text-label-1:has-text("Java")')
            except Exception as e:
                print(f"An error occurred: {e}\n")
                print("There is no Java button\n")
                continue
        
        java_code = page.inner_html('.language-java')
        tree = html.fromstring(java_code)
        target_java = tree.text_content()

        # Already create "folder_number_name"
        text_java = f"{folder_number_name}/{file_name_number}.java"
        with open(text_java, "w") as f:
            f.write(target_java)


        browser.close()
