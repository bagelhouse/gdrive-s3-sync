
type Tokens = {

    refresh_token?: string | null;
    /*** The time in ms at which this token is thought to expire.*/
    expiry_date?: number | null;
    /*** A token that can be sent to a Google API.*/
    access_token?: string | null;
    /*** Identifies the type of token returned. At this time, this field always has the value Bearer.*/
    new_access_token?: boolean;
    /*** Signifies wether a new token is being returned or not */
    token_type?: string | null;
    /*** A JWT that contains identity information about the user that is digitally signed by Google.*/
    id_token?: string | null;
    /*** The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.*/
    scope?: string;
  }