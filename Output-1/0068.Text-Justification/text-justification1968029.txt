// https://leetcode.com/problems/text-justification/solutions/1968029/rust-solution/
pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
    let mut response = vec!{};
    let mut start = 0;

    while let Some(starting_word) = words.get(start) {
        let mut current_width = starting_word.chars().count() as i32;
        let mut end = start + 1;

        while let Some(ending_word) = words.get(end) {
            let check_width = ending_word.chars().count() as i32 + 1;

            if current_width + check_width <= max_width {
                current_width += check_width;
                end += 1;
            } else {
                break;
            }
        }

        //A single word line is only left justified, treat it the same as the final line.
        if end == words.len() || end - start == 1 { 
            response.push(justify_last_string(&words[start..end], max_width));
        } else {
            response.push(justify_string(&words[start..end], max_width));
        }

        start = end; //end is exclusive here, start on the next line
    }

    response
}

pub fn justify_string(words: &[String], width: i32) -> String {
    let mut response = String::with_capacity(width as usize);

    let spaces_needed = width as usize - words.iter()
        .map(|word| word.chars().count())
        .sum::<usize>();

    let word_count = words.len() - 1; //Count the spaces between the words
    let each_spaces = " ".repeat(spaces_needed / word_count);
    let needs_additional_space = spaces_needed % word_count;

    for (idx, val) in words.into_iter().enumerate() {
        response.push_str(val);
        response.push_str(&each_spaces);

        if idx < needs_additional_space {
            response.push(' '); //remainders get added to the first items
        }
    }

    response[..width as usize].to_string() //cut off the final spaces
}

pub fn justify_last_string(words: &[String], width: i32) -> String {
    let mut response = words.join(" ");

    let remaining_spaces = " ".repeat(width as usize - response.chars().count());
    response.push_str(&remaining_spaces);

    response
}