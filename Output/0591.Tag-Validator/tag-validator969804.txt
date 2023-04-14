// https://leetcode.com/problems/tag-validator/solutions/969804/rust-iterator-high-order-functions-fsm-safe-fast-elegant/
pub struct Solution;

impl Solution {
    pub fn is_valid(code: String) -> bool {
        code.chars().try_fold(Validator::new(), |mut validator, c| {
            validator.handle(c).map(|_| validator)
        })
        .and_then(|validator| match validator.is_end() {
            true => Ok(()),
            _ => Err("EOF"),
        })
        // .map_err(|e| {
        //     eprintln!("Invalid, err: {}", e);
        // })
        .is_ok()
    }
}

type Result = std::result::Result<(), &'static str>;

enum State {
    Init,
    TagName {
        cache: String,
        is_close: bool,
    },
    TagContent,
    CDataTag {
        cache: String,
    },
    CDataContent {
        // stand for close prefix `]]`
        prefix: (bool, bool),
    },
    End,
}

struct Validator {
    state: State,
    stack: Vec<String>,
}

impl Validator {
    fn new() -> Self {
        Self {
            state: State::Init,
            stack: Vec::new(),
        }
    }
}

impl Validator {
    fn is_end(&self) -> bool {
        match &self.state {
            State::End => true,
            _ => false,
        }
    }

    fn handle(&mut self, c: char) -> Result {
        match &self.state {
            State::Init => self.handle_init(c),
            State::TagName { .. } => self.handle_tag_name(c),
            State::TagContent => self.handle_tag_content(c),
            State::CDataTag { .. } => self.handle_cdata_tag(c),
            State::CDataContent { .. } => self.handle_cdata_content(c),
            State::End => self.handle_end(c),
        }
    }

    // In the Init state, only accept '<' character then go into next state: TagName
    fn handle_init(&mut self, c: char) -> Result {
        match (&self.state, c) {
            (State::Init, '<') => {
                self.state = State::TagName {
                    cache: String::new(),
                    is_close: false,
                };
                Ok(())
            }
            (State::Init, _) => Err("Expect <"),
            _ => panic!("Invalid State, expect Init"),
        }
    }

    fn handle_tag_name(&mut self, c: char) -> Result {
        match self.state {
            State::TagName { ref mut cache, ref mut is_close } => {
                match (c, cache.len(), &is_close) {
                    // meet 'A'..='Z', tag name cache should less then 9
                    (c @ 'A' ..= 'Z', 0..=8, _) => {
                        cache.push(c);
                        Ok(())
                    }
                    // meet '>', cache length should in 1..=9
                    // if not is_close then into TagContent
                    ('>', 1..=9, false) => {
                        self.stack.push(cache.to_string());
                        self.state = State::TagContent;
                        Ok(())
                    }
                    // if is_close then into TagContent or End
                    ('>', 1..=9, true) => {
                        match self.stack.pop() {
                            Some(s) if s == *cache => {
                                if self.stack.len() > 0 {
                                    // inner level tag closed, into outer TagContent
                                    self.state = State::TagContent;
                                } else {
                                    // top level tag closed, into End
                                    self.state = State::End;
                                }
                                Ok(())
                            }
                            _ => Err("Wrong close tag"),
                        }
                    }
                    // meet '/' only when not is_close and cache is empty
                    ('/', 0, false) => {
                        *is_close = true;
                        Ok(())
                    }
                    // otherwise invalid tag character
                    // ('/', _, true) | ('/', _, false) => Err("Invalid tag char"),
                    // meet '!' only when cache is empty & not !is_close, which means '!' just after '<'
                    ('!', 0, false) if !self.stack.is_empty() => {
                        self.state = State::CDataTag { cache: String::new() };
                        Ok(())
                    }
                    // you can match more different conditions for more error detail
                    _ => Err("Invalid character in TagName State"),
                }
            }
            _ => panic!("Invalid State, expect TagName"),
        }
    }

    fn handle_tag_content(&mut self, c: char) -> Result {
        match (&self.state, c) {
            // if meet '<', then into inner TagName
            (State::TagContent, '<') => {
                self.state = State::TagName {
                    cache: String::new(),
                    is_close: false,
                };
                Ok(())
            }
            // otherwise all characters would be ok
            (State::TagContent, _) => Ok(()),
            _ => panic!("Invalid State, expect TagContent"),
        }
    }

    fn handle_cdata_tag(&mut self, c: char) -> Result {
        match self.state {
            State::CDataTag { ref mut cache } => {
                match (c, cache.len()) {
                    (c, 0..=6) => {
                        cache.push(c);
                        if "[CDATA[" == cache.as_str() {
                            self.state = State::CDataContent { prefix: (false, false) };
                            Ok(())
                        } else if "[CDATA[".starts_with(cache.as_str()) {
                            Ok(())
                        } else {
                            Err("Wrong CDataTag character")
                        }
                    }
                    _ => Err("CDataTag invalid"),
                }
            }
            _ => panic!("Invalid State, expect CDataTag"),
        }
    }

    fn handle_cdata_content(&mut self, c: char) -> Result {
        match self.state {
            State::CDataContent { ref mut prefix } => {
                match (&prefix.0, &prefix.1, c) {
                    (true, true, '>') => {
                        self.state = State::TagContent;
                        Ok(())
                    }
                    (true, true, ']') => Ok(()),
                    (true, true, _) => {
                        // reset prefix
                        *prefix = (false, false);
                        Ok(())
                    }
                    (true, false, ']') => {
                        *prefix = (true, true);
                        Ok(())
                    }
                    (false, false, ']') => {
                        *prefix = (true, false);
                        Ok(())
                    }
                    _ => Ok(()),
                }
            }
            _ => panic!("Invalid State, expect CDataContent"),
        }
    }

    fn handle_end(&mut self, _c: char) -> Result {
        match self.state {
            State::End => Err("End of code"),
            _ => panic!("Invalid State, expect End"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test() {
        let cases = vec![
            (true, "<DIV>This is the first line ![CDATA[<div>]]></DIV>"),
            (true, "<DIV>>>  ![cdata[]] <![CDATA[<div>]>]]>]]>>]</DIV>"),
            (true, "<TRUE><![CDATA[wahaha]]]><![CDATA[]> wahaha]]></TRUE>"),

            (false, "<DIV>>>  ![cdata[]] </![CDATA[<div>]>]]>]]>>]</DIV>"),
            (false, "<A>  <B> </A>   </B>"),
            (false, "<DIV>  div tag is not closed  <DIV>"),
            (false, "<DIV>  unmatched <  </DIV>"),
            (false, "<DIV> closed tags with invalid tag name  <b>123</b> </DIV>"),
            (false, "<DIV> unmatched tags with invalid tag name  </1234567890> and <CDATA[[]]>  </DIV>"),
            (false, "<DIV>  unmatched start tag <B>  and unmatched end tag </C>  </DIV>"),
            (false, "<A><![CDATA[</A>]]123></A>"),
        ];
        for (expect, arg) in cases {
            assert_eq!(expect, Solution::is_valid(arg.into()));
        }
    }
}
