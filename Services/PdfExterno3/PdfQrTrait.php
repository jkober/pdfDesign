<?php
namespace Design\DesignBundle\Services\PdfExterno3;


use Design\DesignBundle\Services\PdfExterno3\QRcode;

trait PdfQrTrait
{
// agregado para ver si anda el qr ******************************************************************
//--2020-11-04
    /**
     * Print 2D Barcode.
     * @param $code (string) code to print
     * @param $type (string) type of barcode (see tcpdf_barcodes_2d.php for supported formats).
     * @param $x (int) x position in user units
     * @param $y (int) y position in user units
     * @param $w (int) width in user units
     * @param $h (int) height in user units
     * @param $style (array) array of options:<ul>
     * <li>boolean $style['border'] if true prints a border around the barcode</li>
     * <li>int $style['padding'] padding to leave around the barcode in barcode units (set to 'auto' for automatic padding)</li>
     * <li>int $style['hpadding'] horizontal padding in barcode units (set to 'auto' for automatic padding)</li>
     * <li>int $style['vpadding'] vertical padding in barcode units (set to 'auto' for automatic padding)</li>
     * <li>int $style['module_width'] width of a single module in points</li>
     * <li>int $style['module_height'] height of a single module in points</li>
     * <li>array $style['fgcolor'] color array for bars and text</li>
     * <li>mixed $style['bgcolor'] color array for background or false for transparent</li>
     * <li>string $style['position'] barcode position on the page: L = left margin; C = center; R = right margin; S = stretch</li><li>$style['module_width'] width of a single module in points</li>
     * <li>$style['module_height'] height of a single module in points</li></ul>
     * @param $align (string) Indicates the alignment of the pointer next to barcode insertion relative to barcode height. The value can be:<ul><li>T: top-right for LTR or top-left for RTL</li><li>M: middle-right for LTR or middle-left for RTL</li><li>B: bottom-right for LTR or bottom-left for RTL</li><li>N: next line</li></ul>
     * @param $distort (boolean) if true distort the barcode to fit width and height, otherwise preserve aspect ratio
     * @author Nicola Asuni
     * @since 4.5.037 (2009-04-07)
     * @public
     */
    public function write2DBarcode($code, $type, $x = '', $y = '', $w = '', $h = '', $style = '', $align = '', $distort = false)
    {
        $barcodeobj = new QRcode($code, $type);
        $arrcode = $barcodeobj->getBarcodeArray();
        if (($arrcode === false) OR empty($arrcode) OR !isset($arrcode['num_rows']) OR ($arrcode['num_rows'] == 0) OR !isset($arrcode['num_cols']) OR ($arrcode['num_cols'] == 0)) {
            $this->Error('Error in 2D barcode string');
        }
        if (!is_array( $style))  {
            $style = array();
        }
        // set default values
        if ( !isset($style['position'])) {
            $style['position'] = '';
        }
        if (  !isset($style['fgcolor'])) {
            $style['fgcolor'] = array(0, 0, 0); // default black
        }
        if (!isset($style['bgcolor'])) {
            $style['bgcolor'] = false; // default transparent
        }
        if (!isset($style['border'])) {
            $style['border'] = false;
        }
        // padding
        if (!isset($style['padding'])) {
            $style['padding'] = 0;
        } elseif ($style['padding'] === 'auto') {
            $style['padding'] = 4;
        }
        if (!isset($style['hpadding'])) {
            $style['hpadding'] = $style['padding'];
        } elseif ($style['hpadding'] === 'auto') {
            $style['hpadding'] = 4;
        }
        if (!isset($style['vpadding'])) {
            $style['vpadding'] = $style['padding'];
        } elseif ($style['vpadding'] === 'auto') {
            $style['vpadding'] = 4;
        }
        $hpad = (2 * $style['hpadding']);
        $vpad = (2 * $style['vpadding']);
        // cell (module) dimension
        if (!isset($style['module_width'])) {
            $style['module_width'] = 1; // width of a single module in points
        }
        if (!isset($style['module_height'])) {
            $style['module_height'] = 1; // height of a single module in points
        }
        if ($x === '') {
            $x = $this->x;
        }
        if ($y === '') {
            $y = $this->y;
        }
        // check page for no-write regions and adapt page margins if necessary
//kober        list($x, $y) = $this->checkPageRegions($h, $x, $y);
        // number of barcode columns and rows
        $rows = $arrcode['num_rows'];
        $cols = $arrcode['num_cols'];
        if (($rows <= 0) || ($cols <= 0)) {
            $this->Error('Error in 2D barcode string');
        }
        // module width and height
        $mw = $style['module_width'];
        $mh = $style['module_height'];
        if (($mw <= 0) OR ($mh <= 0)) {
            $this->Error('Error in 2D barcode string');
        }
        // get max dimensions
//ko        if ($this->rtl) {
        $maxw = $x - $this->lMargin;
//ko        } else {
//ko            $maxw = $this->w - $this->rMargin - $x;
//ko        }
        $maxh = ($this->h - $this->tMargin - $this->bMargin);
        $ratioHW = ((($rows * $mh) + $hpad) / (($cols * $mw) + $vpad));
        $ratioWH = ((($cols * $mw) + $vpad) / (($rows * $mh) + $hpad));
        if (!$distort) {
            if (($maxw * $ratioHW) > $maxh) {
                $maxw = $maxh * $ratioWH;
            }
            if (($maxh * $ratioWH) > $maxw) {
                $maxh = $maxw * $ratioHW;
            }
        }
        // set maximum dimensions
        if ($w > $maxw) {
            $w = $maxw;
        }
        if ($h > $maxh) {
            $h = $maxh;
        }
        // set dimensions
        if ((($w === '') OR ($w <= 0)) AND (($h === '') OR ($h <= 0))) {
            $w = ($cols + $hpad) * ($mw / $this->k);
            $h = ($rows + $vpad) * ($mh / $this->k);
        } elseif (($w === '') OR ($w <= 0)) {
            $w = $h * $ratioWH;
        } elseif (($h === '') OR ($h <= 0)) {
            $h = $w * $ratioHW;
        }
        // barcode size (excluding padding)
        $bw = ($w * $cols) / ($cols + $hpad);
        $bh = ($h * $rows) / ($rows + $vpad);
        // dimension of single barcode cell unit
        $cw = $bw / $cols;
        $ch = $bh / $rows;
        if (!$distort) {
            if (($cw / $ch) > ($mw / $mh)) {
                // correct horizontal distortion
                $cw = $ch * $mw / $mh;
                $bw = $cw * $cols;
                $style['hpadding'] = ($w - $bw) / (2 * $cw);
            } else {
                // correct vertical distortion
                $ch = $cw * $mh / $mw;
                $bh = $ch * $rows;
                $style['vpadding'] = ($h - $bh) / (2 * $ch);
            }
        }
        // fit the barcode on available space
//ko        list($w, $h, $x, $y) = $this->fitBlock($w, $h, $x, $y, false);
        // set alignment
        $this->img_rb_y = $y + $h;
        // set alignment
//ko        if ($this->rtl) {
//ko            if ($style['position'] == 'L') {
        $xpos = $this->lMargin + $x;
        $xpos =  $x;
//ko            } elseif ($style['position'] == 'C') {
//ko                $xpos = ($this->w + $this->lMargin - $this->rMargin - $w) / 2;
//ko            } elseif ($style['position'] == 'R') {
//ko                $xpos = $this->w - $this->rMargin - $w;
//ko            } else {
//ko                $xpos = $x - $w;
//ko            }
        $this->img_rb_x = $xpos;
        /*        } else {
                    if ($style['position'] == 'L') {
                        $xpos = $this->lMargin;
                    } elseif ($style['position'] == 'C') {
                        $xpos = ($this->w + $this->lMargin - $this->rMargin - $w) / 2;
                    } elseif ($style['position'] == 'R') {
                        $xpos = $this->w - $this->rMargin - $w;
                    } else {
                        $xpos = $x;
                    }
                    $this->img_rb_x = $xpos + $w;
                }
        */
        $xstart = $xpos + ($style['hpadding'] * $cw);
        $ystart = $y + ($style['vpadding'] * $ch);
        // barcode is always printed in LTR direction
        $this->rtl = false;
        // print background color
        if ($style['bgcolor']) {
            $this->Rect($xpos, $y, $w, $h, $style['border'] ? 'DF' : 'F', '', $style['bgcolor']);
        } elseif ($style['border']) {
            $this->Rect($xpos, $y, $w, $h, 'D');
        }
        // set foreground color
        $this->SetDrawColorArray($style['fgcolor']);
        // print barcode cells
        // for each row
        for ($r = 0; $r < $rows; ++$r) {
            $xr = $xstart;
            // for each column
            for ($c = 0; $c < $cols; ++$c) {
                if ($arrcode['bcode'][$r][$c] == 1) {
                    // draw a single barcode cell
                    $this->Rect($xr, $ystart, $cw, $ch, 'F', array(), $style['fgcolor']);
                }
                $xr += $cw;
            }
            $ystart += $ch;
        }
        // restore original direction
    }

    /**
     * Defines the color used for all drawing operations (lines, rectangles and cell borders).
     * It can be expressed in RGB, CMYK or GRAY SCALE components.
     * The method can be called before the first page is created and the value is retained from page to page.
     * @param $color (array) Array of colors (1, 3 or 4 values).
     * @param $ret (boolean) If true do not send the PDF command.
     * @return string the PDF command
     * @public
     * @since 3.1.000 (2008-06-11)
     * @see SetDrawColor()
     */
    public function SetDrawColorArray($color, $ret = false)
    {
        return $this->setColorArray('draw', $color, $ret);
    }

    /**
     * Set the color array for the specified type ('draw', 'fill', 'text').
     * It can be expressed in RGB, CMYK or GRAY SCALE components.
     * The method can be called before the first page is created and the value is retained from page to page.
     * @param $type (string) Type of object affected by this color: ('draw', 'fill', 'text').
     * @param $color (array) Array of colors (1=gray, 3=RGB, 4=CMYK or 5=spotcolor=CMYK+name values).
     * @param $ret (boolean) If true do not send the PDF command.
     * @return (string) The PDF command or empty string.
     * @public
     * @since 3.1.000 (2008-06-11)
     */
    public function setColorArray($type, $color, $ret = false)
    {
        if (is_array($color)) {
            $color = array_values($color);
            // component: grey, RGB red or CMYK cyan
            $c = isset($color[0]) ? $color[0] : -1;
            // component: RGB green or CMYK magenta
            $m = isset($color[1]) ? $color[1] : -1;
            // component: RGB blue or CMYK yellow
            $y = isset($color[2]) ? $color[2] : -1;
            // component: CMYK black
            $k = isset($color[3]) ? $color[3] : -1;
            // color name
            $name = isset($color[4]) ? $color[4] : '';
            if ($c >= 0) {
                return $this->setColor($type, $c, $m, $y, $k, $ret, $name);
            }
        }
        return '';
    }

    /**
     * Defines the color used by the specified type ('draw', 'fill', 'text').
     * @param $type (string) Type of object affected by this color: ('draw', 'fill', 'text').
     * @param $col1 (float) GRAY level for single color, or Red color for RGB (0-255), or CYAN color for CMYK (0-100).
     * @param $col2 (float) GREEN color for RGB (0-255), or MAGENTA color for CMYK (0-100).
     * @param $col3 (float) BLUE color for RGB (0-255), or YELLOW color for CMYK (0-100).
     * @param $col4 (float) KEY (BLACK) color for CMYK (0-100).
     * @param $ret (boolean) If true do not send the command.
     * @param $name (string) spot color name (if any)
     * @return (string) The PDF command or empty string.
     * @public
     * @since 5.9.125 (2011-10-03)
     */
    public function setColor($type, $col1 = 0, $col2 = -1, $col3 = -1, $col4 = -1, $ret = false, $name = '')
    {
        // set default values
        if (!is_numeric($col1)) {
            $col1 = 0;
        }
        if (!is_numeric($col2)) {
            $col2 = -1;
        }
        if (!is_numeric($col3)) {
            $col3 = -1;
        }
        if (!is_numeric($col4)) {
            $col4 = -1;
        }
        // set color by case
        $suffix = '';
        if (($col2 == -1) AND ($col3 == -1) AND ($col4 == -1)) {
            // Grey scale
            $col1 = max(0, min(255, $col1));
            $intcolor = array('G' => $col1);
            $pdfcolor = sprintf('%F ', ($col1 / 255));
            $suffix = 'g';
        } elseif ($col4 == -1) {
            // RGB
            $col1 = max(0, min(255, $col1));
            $col2 = max(0, min(255, $col2));
            $col3 = max(0, min(255, $col3));
            $intcolor = array('R' => $col1, 'G' => $col2, 'B' => $col3);
            $pdfcolor = sprintf('%F %F %F ', ($col1 / 255), ($col2 / 255), ($col3 / 255));
            $suffix = 'rg';
        } else {
            $col1 = max(0, min(100, $col1));
            $col2 = max(0, min(100, $col2));
            $col3 = max(0, min(100, $col3));
            $col4 = max(0, min(100, $col4));
            if (empty($name)) {
                // CMYK
                $intcolor = array('C' => $col1, 'M' => $col2, 'Y' => $col3, 'K' => $col4);
                $pdfcolor = sprintf('%F %F %F %F ', ($col1 / 100), ($col2 / 100), ($col3 / 100), ($col4 / 100));
                $suffix = 'k';
            } else {
                // SPOT COLOR
                $intcolor = array('C' => $col1, 'M' => $col2, 'Y' => $col3, 'K' => $col4, 'name' => $name);
                $this->AddSpotColor($name, $col1, $col2, $col3, $col4);
                $pdfcolor = $this->setSpotColor($type, $name, 100);
            }
        }
        switch ($type) {
            case 'draw': {
                $pdfcolor .= strtoupper($suffix);
                $this->DrawColor = $pdfcolor;
                $this->strokecolor = $intcolor;
                break;
            }
            case 'fill': {
                $pdfcolor .= $suffix;
                $this->FillColor = $pdfcolor;
                $this->bgcolor = $intcolor;
                break;
            }
            case 'text': {
                $pdfcolor .= $suffix;
                $this->TextColor = $pdfcolor;
                $this->fgcolor = $intcolor;
                break;
            }
        }
        $this->ColorFlag = ($this->FillColor != $this->TextColor);
        if (($type != 'text') AND ($this->state == 2)) {
            if (!$ret) {
                $this->_out($pdfcolor);
            }
            return $pdfcolor;
        }
        return '';
    }

    protected function getGraphicVars()
    {
        $grapvars = array(
            'FontFamily' => $this->FontFamily,
            'FontStyle' => $this->FontStyle,
            'FontSizePt' => $this->FontSizePt,
            'rMargin' => $this->rMargin,
            'lMargin' => $this->lMargin,
            'cell_padding' => $this->cell_padding,
            'cell_margin' => $this->cell_margin,
            'LineWidth' => $this->LineWidth,
            'linestyleWidth' => $this->linestyleWidth,
            'linestyleCap' => $this->linestyleCap,
            'linestyleJoin' => $this->linestyleJoin,
            'linestyleDash' => $this->linestyleDash,
            'textrendermode' => $this->textrendermode,
            'textstrokewidth' => $this->textstrokewidth,
            'DrawColor' => $this->DrawColor,
            'FillColor' => $this->FillColor,
            'TextColor' => $this->TextColor,
            'ColorFlag' => $this->ColorFlag,
            'bgcolor' => $this->bgcolor,
            'fgcolor' => $this->fgcolor,
            'htmlvspace' => $this->htmlvspace,
            'listindent' => $this->listindent,
            'listindentlevel' => $this->listindentlevel,
            'listnum' => $this->listnum,
            'listordered' => $this->listordered,
            'listcount' => $this->listcount,
            'lispacer' => $this->lispacer,
            'cell_height_ratio' => $this->cell_height_ratio,
            'font_stretching' => $this->font_stretching,
            'font_spacing' => $this->font_spacing,
            'alpha' => $this->alpha,
            // extended
            'lasth' => $this->lasth,
            'tMargin' => $this->tMargin,
            'bMargin' => $this->bMargin,
            'AutoPageBreak' => $this->AutoPageBreak,
            'PageBreakTrigger' => $this->PageBreakTrigger,
            'x' => $this->x,
            'y' => $this->y,
            'w' => $this->w,
            'h' => $this->h,
            'wPt' => $this->wPt,
            'hPt' => $this->hPt,
            'fwPt' => $this->fwPt,
            'fhPt' => $this->fhPt,
            'page' => $this->page,
            'current_column' => $this->current_column,
            'num_columns' => $this->num_columns
        );
        return $grapvars;
    }


}