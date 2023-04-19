// https://leetcode.com/problems/valid-number/solutions/290475/rust-solution-0ms-100-2-4mb-100-by-writing-a-parser/
use std::iter::Peekable;
use std::str::Chars;

impl Solution {
    pub fn is_number(s: String) -> bool {
        Parser::new(&s).parse().is_ok()
    }
}

struct Parser<'a> {
    iter: Peekable<Chars<'a>>
}

impl<'a> Parser<'a> {
    fn new(s: &str) -> Parser {
        Parser {
            iter: s.chars().peekable()
        }
    }

    fn parse(&mut self) -> Result<(), ()> {
        self.skip_ws();
        self.parse_number()?;
        self.skip_ws();

        if let None = self.iter.peek() {
            Ok(())
        } else {
            Err(())
        }
    }

    fn skip_ws(&mut self) {
        while let Some(' ') = self.iter.peek() {
            self.iter.next();
        }
    }

    fn parse_number(&mut self) -> Result<(), ()> {
        self.parse_decimals()?;
        if let Some(&'e') = self.iter.peek() {
            self.iter.next();
            self.parse_nodecimals()?;
        }
        Ok(())
    }

    fn parse_decimals(&mut self) -> Result<(), ()> {
        if let Some(op) = self.iter.peek() {
            match op {
                '+' | '-' => { self.iter.next(); },
                _ => {},
            }
        }
        if let Some(c) = self.iter.peek() {
            match c {
                '0'...'9' => {
                    self.parse_digits()?;
                    if let Some('.') = self.iter.peek() {
                        self.iter.next();
                        // it is ok even failed
                        self.parse_digits().ok();
                    }
                }
                '.' => {
                    self.iter.next();
                    self.parse_digits()?;
                }
                _ => return Err(())
            }
            Ok(())
        } else {
            Err(())
        }
    }

    fn parse_nodecimals(&mut self) -> Result<(), ()> {
        if let Some(op) = self.iter.peek() {
            match op {
                '+' | '-' => { self.iter.next(); },
                _ => {},
            }
        }
        if let Some(c) = self.iter.peek() {
            match c {
                '0'...'9' => {
                    self.parse_digits();
                }
                _ => return Err(())
            }
            Ok(())
        } else {
            Err(())
        }
    }

    fn parse_digits(&mut self) -> Result<(), ()> {
        let mut parsed = false;
        while let Some('0'...'9') = self.iter.peek() {
            if !parsed { parsed = true; }
            self.iter.next();
        }
        if parsed { Ok(()) } else { Err(()) }
    }
}