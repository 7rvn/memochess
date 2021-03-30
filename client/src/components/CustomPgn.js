import * as React from "react";

function CustomPgn() {
  return (
    <form>
      {" "}
      <label>
        PGN:
        <input type="text" name="name" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default CustomPgn;
