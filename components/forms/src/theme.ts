/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as angleSlider } from "#angle-slider/recipe.ts";
import { recipe as checkboxCard } from "#checkbox-card/recipe.ts";
import { recipe as checkboxGroup } from "#checkbox/checkbox-group.recipe.ts";
import { recipe as checkbox } from "#checkbox/recipe.ts";
import { recipe as colorPicker } from "#color-picker/recipe.ts";
import { recipe as combobox } from "#combobox/recipe.ts";
import { recipe as dateInput } from "#date-input/recipe.ts";
import { recipe as datePicker } from "#date-picker/recipe.ts";
import { recipe as editable } from "#editable/recipe.ts";
import { recipe as field } from "#field/recipe.ts";
import { recipe as fieldset } from "#fieldset/recipe.ts";
import { recipe as fileUpload } from "#file-upload/recipe.ts";
import { recipe as inputGroup } from "#input-group/recipe.ts";
import { recipe as input } from "#input/recipe.ts";
import { recipe as nativeSelect } from "#native-select/recipe.ts";
import { recipe as numberInput } from "#number-input/recipe.ts";
import { recipe as passwordInput } from "#password-input/recipe.ts";
import { recipe as phoneInput } from "#phone-input/recipe.ts";
import { recipe as pinInput } from "#pin-input/recipe.ts";
import { recipe as radioCard } from "#radio-card/recipe.ts";
import { recipe as radioGroup } from "#radio-group/recipe.ts";
import { recipe as ratingGroup } from "#rating-group/recipe.ts";
import { recipe as searchInput } from "#search-input/recipe.ts";
import { recipe as segmentGroup } from "#segment-group/recipe.ts";
import { recipe as select } from "#select/recipe.ts";
import { recipe as signaturePad } from "#signature-pad/recipe.ts";
import { recipe as slider } from "#slider/recipe.ts";
import { recipe as switchRecipe } from "#switch/recipe.ts";
import { recipe as tagsInput } from "#tags-input/recipe.ts";
import { recipe as textarea } from "#textarea/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-forms",
  theme: {
    extend: {
      recipes: { checkboxGroup, input, numberInput, passwordInput, searchInput },
      slotRecipes: {
        angleSlider,
        checkbox,
        checkboxCard,
        colorPicker,
        combobox,
        dateInput,
        datePicker,
        editable,
        field,
        fieldset,
        fileUpload,
        inputGroup,
        nativeSelect,
        phoneInput,
        pinInput,
        radioCard,
        radioGroup,
        ratingGroup,
        segmentGroup,
        select,
        signaturePad,
        slider,
        switch: switchRecipe,
        tagsInput,
        textarea,
      },
    },
  },
});
