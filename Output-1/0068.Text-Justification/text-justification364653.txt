// https://leetcode.com/problems/text-justification/solutions/364653/rust-0ms-solution/
use std::cmp::max;
impl Solution {
    pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
        let max_width = max_width as usize;
        let mut separated: Vec<Vec<String>> = vec![vec![]];
        /////////////////////////// logic to separate words into a vec of lines
        let mut counter = 0;
        let mut cur_size = 0;

        for word in words {
            let word_len = if cur_size == 0 {
                // first word in the line
                word.len()
            } else {
                // any other word takes into account a space
                word.len() + 1
            };

            cur_size += word_len;
            if cur_size > max_width {
                //new line
                separated.push(vec![]);
                counter += 1;
                cur_size = word.len();
            }
            // add word to line
            separated[counter].push(word);
        }

        /////////////////////////// logic to join the words with the padding
        separated
            .iter()
            .enumerate()
            .map(|(i, v): (usize, &Vec<String>)| {
                let temp = v.join(" ");
                // width of the line without padding
                let width = temp.len();
                //space characters to add in total
                let space_pad = max_width - width;
                if space_pad == 0 {
                    return temp;
                }

                if i < separated.len() - 1 {
                    // number of times padding will be applied. 1 if it's just one word.
                    let amount_of_pads = max(v.len() as i32 - 1, 1) as usize;
                    // the smallest unit of padding to apply
                    let indiv_pad = space_pad / amount_of_pads;
                    let mut pads: Vec<String> = if indiv_pad != 0 {
                        (0..space_pad)
                            .map(|_| " ") //total number of padding spaces
                            .collect::<String>()
                            .as_bytes()
                            .chunks(indiv_pad) //divide into chunks of the smallest unit of padding
                            .map(|c| String::from_utf8(Vec::from(c)))
                            .collect::<Result<Vec<String>, _>>()
                            .unwrap()
                    } else {
                        //the line will have padding between the first few words, but not the rest
                        (0..amount_of_pads).map(|_| String::from("")).collect()
                    };
                    // left-over padding spaces
                    let pads_left = space_pad - indiv_pad * amount_of_pads;

                    // add the left-overs to the beginning
                    for pad in pads.iter_mut().take(pads_left) {
                        pad.push(' ');
                    }

                    let mut response = String::with_capacity(max_width);

                    for j in 0..v.len() {
                        // add the word
                        response.push_str(&v[j]);
                        if v.len() == 1 || j < v.len() - 1 {
                            // add the padding
                            response.push_str(&pads[j]);
                            if v.len() != 1 {
                                //add the minimal space between words
                                response.push_str(" ");
                            }
                        }
                    }

                    response
                } else {
                    let mut response = temp;
                    // fill the rest of the line with space
                    response.push_str(&(0..space_pad).map(|_| " ").collect::<String>());
                    response
                }
            })
            .collect()
    }
}