# bitwise operators  (like | or ~) 
In the "32-bit (Signed) Integers" section of Chapter 2, we covered how bitwise operators in JS are defined only for 32-bit operations, which means they force their operands to conform to 32-bit value representations. The rules for how this happens are controlled by the ToInt32 abstract operation (ES5 spec, section 9.5).

ToInt32 first does a ToNumber coercion, which means if the value is "123", it's going to first become 123 before the ToInt32 rules are applied.