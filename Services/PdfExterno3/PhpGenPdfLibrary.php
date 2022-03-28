<?php
namespace Design\DesignBundle\Services\PdfExterno3;
//use Design\DesignBundle\Services\PdfExterno3\PdfGenRotate;
//use Design\DesignBundle\Services\PdfExterno3\tcpdf\tcpdf as fromImportClass; 
    //la Tcpdf No funciona todo como deberia con los saltos de pagina
//use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfTcpdf as fromImportClass;
    //esto esta probado y andando
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfFPDF as fromImportClass;
//------------------------------------------------------------------------------
//use Design\DesignBundle\Services\PdfExterno3\PdfGenRotate;
class PhpGenPdfLibrary extends fromImportClass {
    use PdfTags;
    use PdfQrTrait;
    use pdfAttach;
    protected $isUtf8=true;
    var $fromTcpdf=true;
    var $phpGenPdfHead;
    var $phpGenPdf;
    var $phpGenPdfFooter;
    var $impresoDocuemntHead = false;
    var $impresoDocuemntFooter = false;
    //---------------------- i 2 en 5 inicio
    function i25($xpos, $ypos, $code, $basewidth=1, $height=10){

        $wide = $basewidth;
        $_xpos = $xpos;
        $narrow = $basewidth / 3 ;

        // wide/narrow codes for the digits
        $barChar['0'] = 'nnwwn';
        $barChar['1'] = 'wnnnw';
        $barChar['2'] = 'nwnnw';
        $barChar['3'] = 'wwnnn';
        $barChar['4'] = 'nnwnw';
        $barChar['5'] = 'wnwnn';
        $barChar['6'] = 'nwwnn';
        $barChar['7'] = 'nnnww';
        $barChar['8'] = 'wnnwn';
        $barChar['9'] = 'nwnwn';
        $barChar['A'] = 'nn';
        $barChar['Z'] = 'wn';

        // add leading zero if code-length is odd
        if(strlen($code) % 2 != 0){
            $code = $code.'0';
        }

        //$this->Text($xpos, $ypos + $height + 4, $code);
        $this->SetFillColor(0);
        $invalid=false;
        // add start and stop codes
        $code = 'AA'.strtolower($code).'ZA';

        for($i=0; $i<strlen($code); $i=$i+2){
            // choose next pair of digits
            $charBar = $code[$i];
            $charSpace = $code[$i+1];
            // check whether it is a valid digit
            if(!isset($barChar[$charBar])){
                $invalid=true;
                $charBar=0;
            }
            if(!isset($barChar[$charSpace])){
                $invalid=true;
                $charSpace=0;
            }
            // create a wide/narrow-sequence (first digit=bars, second digit=spaces)
            $seq = '';
            for($s=0; $s<strlen($barChar[$charBar]); $s++){
                $seq .= $barChar[$charBar][$s] . $barChar[$charSpace][$s];
            }
            for($bar=0; $bar<strlen($seq); $bar++){
                // set lineWidth depending on value
                if($seq[$bar] == 'n'){
                    $lineWidth = $narrow;
                }else{
                    $lineWidth = $wide;
                }
                // draw every second value, because the second digit of the pair is represented by the spaces
                if($bar % 2 == 0){
                    $this->Rect($xpos, $ypos, $lineWidth, $height, 'F');
                }
                $xpos += $lineWidth;
            }

        }
        if ( $invalid) {
            $this->Text($_xpos, $ypos , "Codigo Invalido");
        }
        return $xpos;
    }
    //---------------------- i 2 en 5 fin
    public function getH() {
        return $this->h;
    }
    public function setIsUtf8($isUtf8){
        $this->isUtf8=$isUtf8;
    }
    public function getIsUtf8(){
        return $this->isUtf8;
    }
    
    public function __construct($orientation = 'P', $unit = 'mm', $size = 'A4') {
        parent::__construct($orientation, $unit, $size);

        $existed = in_array("var2", stream_get_wrappers());
        if ($existed) {
            stream_wrapper_unregister("var2");
        }
        stream_wrapper_register('var2', 'Design\DesignBundle\Services\PdfExterno3\VariableStream');
    }
    
    public function setPageBreakTrigger($PageBreakTrigger) {
        $this->PageBreakTrigger = $PageBreakTrigger;
        $this->PageBreakTriggerO = $PageBreakTrigger;
    }
    public function getPageBreakTrigger() {
        return $this->PageBreakTrigger;
    }
    
    public function setDocumentHead() {
        $this->impresoDocuemntHead = true;
    }

    public function Header() {
        if ($this->impresoDocuemntHead == true) {
            if (is_object($this->phpGenPdfHead)) {
                if (is_object($this->phpGenPdf)) {
                    $this->phpGenPdfHead->write($this->phpGenPdf);
                }
            }
        }
    }

    public function Footer() {
        if (is_object($this->phpGenPdfFooter)) {
            if (is_object($this->phpGenPdf)) {
                $this->phpGenPdfFooter->write($this->phpGenPdf);
            }
        }
    }

    function setPhpGenPdf(PhpGenPdfHead $phpGenPdfHead, PhpGenPdf $phpGenPdf, PhpGenPdfFooter $foot) {
        $this->phpGenPdfHead = $phpGenPdfHead;
        $this->phpGenPdf = $phpGenPdf;
        $this->phpGenPdfFooter = $foot;
    }
    public function setBreakPage($break){
        $this->PageBreakTrigger = $break;
    }
    public function setPageIfSaltSection($obj, $top, $left){
        if  ($this->checkPageBreak($obj->PositionTop, $top)) {
            $aux1 = $this->PageBreakTrigger;
            $this->addPage();
            $aux2 = $this->PageBreakTrigger;
            $a1 = $this->phpGenPdfHead->getHeightHead();
            $a2 = $this->PageBreakTrigger;
            $a3 = $obj->PositionTop;
            $desde = $obj->PositionTop - ($aux1  - $top) + $this->phpGenPdfHead->getHeightHead();
            $page = $this->PageNo();
            $this->SetXY($obj->PositionLeft + $left, $desde);
        }else{
            $this->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);

        }
        return true;
        
    }

    public function setPageIfSalt($obj, $top, $left,$Salta=false){
        if  ($this->checkPageBreak($obj->PositionTop, $top)) {
            $aux1 = $this->PageBreakTrigger;
            $this->addPage();
            $aux2 = $this->PageBreakTrigger;
            $a1 = $this->phpGenPdfHead->getHeightHead();
            $a2 = $this->PageBreakTrigger;
            $a3 = $obj->PositionTop;
            $desde = $obj->PositionTop - ($aux1  - $top) + $this->phpGenPdfHead->getHeightHead();
            $page = $this->PageNo();
            $this->SetXY($obj->PositionLeft + $left, $desde);
        }else{
            $this->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);

        }
        return true;
        
    }
    public function getNewPageBreak($height,$listaItems){
        $pageBreak = (object)array();
        $pageBreak->isNew = false;
        $pageBreak->pageBreakOld = $this->PageBreakTrigger;
        $pageBreak->pageBreakNew = 0;
        if ($this->getY() + $height >= $this->PageBreakTrigger) {
            //------------------------------------------------------------------
            $yDesde = $this->getY();
            $CantItems = count($listaItems);
            $fin = false;
            //------------------------------------------------------------------
            while ($fin == false) {
                $fin = true;
                for ($i = 0; $i < $CantItems; $i++) {
                    // esto no entiendo porque esta asi
                    if (($yDesde + $listaItems[$i]->Top) <= $pageBreak->pageBreakOld) {
                        if (($yDesde + $listaItems[$i]->Top + $listaItems[$i]->Height) > ( $pageBreak->pageBreakOld + 0.01 ) ) {
                            $pageBreak->isNew = true;
                            $pageBreak->pageBreakNew = $yDesde + $listaItems[$i]->Top;
                            //$break = $yDesde + $itemA[$i]->Top;
                            $fin = false;
                            return $pageBreak;
                            break;
                        }
                    }
                }
            }
        
        }
        return $pageBreak;
    }
    
    function MemImage($data, $x = null, $y = null, $w = 0, $h = 0, $link = '') {
        $v = 'img' . md5($data);
        VariableStream::$file[$v] = $data;
        $a = getimagesize('var2://' . $v);
        if (!$a)
            $this->Error('Invalid image data');
        $type = substr(strstr($a['mime'], '/'), 1);
        $this->Image('var2://' . $v, $x, $y, $w, $h, $type, $link);
        unset(VariableStream::$file[$v]);
    }

    function GDImage($im, $x = null, $y = null, $w = 0, $h = 0, $link = '') {
        ob_start();
        imagepng($im);
        $data = ob_get_clean();
        $this->MemImage($data, $x, $y, $w, $h, $link);
    }
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    function WriteTable($tcolums) {
        // go through all colums
        $auxLeft = $this->GetX();
        for ($i = 0; $i < sizeof($tcolums); $i++) {
            $current_col = $tcolums[$i];
            $height = 0;

            // get max height of current col
            $this->setX($auxLeft);
            $nb = 0;
            for ($b = 0; $b < sizeof($current_col); $b++) {
                // set style
                $this->SetFont($current_col[$b]['font_name'], $current_col[$b]['font_style'], $current_col[$b]['font_size']);
                $color = explode(",", $current_col[$b]['fillcolor']);
                $this->SetFillColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['textcolor']);
                $this->SetTextColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['drawcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);
                $this->SetLineWidth($current_col[$b]['linewidth']);

                $nb = max($nb, $this->NbLines($current_col[$b]['width'], $current_col[$b]['text']));
                $height = $current_col[$b]['height'];
            }
            $h = $height * $nb;


            // Issue a page break first if needed
            $this->CheckPageBreakTable($h);
            $this->setX($auxLeft);
            // Draw the cells of the row
            for ($b = 0; $b < sizeof($current_col); $b++) {
                $w = $current_col[$b]['width'];
                $a = $current_col[$b]['align'];

                // Save the current position
                $x = $this->GetX();
                $y = $this->GetY();

                // set style
                $this->SetFont($current_col[$b]['font_name'], $current_col[$b]['font_style'], $current_col[$b]['font_size']);
                $color = explode(",", $current_col[$b]['fillcolor']);
                $this->SetFillColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['textcolor']);
                $this->SetTextColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['drawcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);
                $this->SetLineWidth($current_col[$b]['linewidth']);

                $color = explode(",", $current_col[$b]['fillcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);


                // Draw Cell Background
                $this->Rect($x, $y, $w, $h, 'FD');

                $color = explode(",", $current_col[$b]['drawcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);

                // Draw Cell Border
                if (substr_count($current_col[$b]['linearea'], "T") > 0) {
                    $this->Line($x, $y, $x + $w, $y);
                }

                if (substr_count($current_col[$b]['linearea'], "B") > 0) {
                    $this->Line($x, $y + $h, $x + $w, $y + $h);
                }

                if (substr_count($current_col[$b]['linearea'], "L") > 0) {
                    $this->Line($x, $y, $x, $y + $h);
                }

                if (substr_count($current_col[$b]['linearea'], "R") > 0) {
                    $this->Line($x + $w, $y, $x + $w, $y + $h);
                }


                // Print the text
                $this->MultiCell($w, $current_col[$b]['height'], $current_col[$b]['text'], 0, $a, 0);

                // Put the position to the right of the cell
                $this->SetXY($x + $w, $y);
            }

            // Go to the next line
            $this->Ln($h);
        }
    }

    // If the height h would cause an overflow, add a new page immediately
    function CheckPageBreakTable($h) {
        if ($this->GetY() + $h > $this->PageBreakTrigger)
            $this->AddPage($this->CurOrientation);
    }

    // Computes the number of lines a MultiCell of width w will take
    function NbLines($w, $txt) {
        $cw = &$this->CurrentFont['cw'];
        if ($w == 0)
            $w = $this->w - $this->rMargin - $this->x;
        $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;
        $s = str_replace("\r", '', $txt);
        $nb = strlen($s);
        if ($nb > 0 and $s[$nb - 1] == "\n")
            $nb--;
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if ($c == ' ')
                $sep = $i;
            $l+=$cw[$c];
            if ($l > $wmax) {
                if ($sep == -1) {
                    if ($i == $j)
                        $i++;
                }
                else
                    $i = $sep + 1;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            }
            else
                $i++;
        }
        return $nl;
    }

    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------    
}

?>
