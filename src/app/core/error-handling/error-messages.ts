export const ErrorMessages = {
   generation: {
      INVALID_CONFIG_VALUES: "Name generation failed due to invalid config values!",
      LETTER_SET_DEPLETED: "No letters available, excluding and including letters ignored!"
   },
   database: {
      ADD_FAILURE: "Failed to add name to cloud database!",
      DUPLICATE_NAME: "This name is already saved!",
      DELETE_FAILURE: "Failed to delete name from cloud database!",
      SYNC_FAILURE: "Failed to sync names with cloud!"
   }
} as const;
